import express, { Request, request, response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { connectMongo } from "./db";
import "./models";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { authRouter } from "./routes/auth";
import { categoriesRouter } from "./routes/categories";
import { seedAll } from "./seed";
import uploadSingle, { uploadMultiple } from "rod-fileupload";
import { cloudinaryConfig } from "./cloudinary";

async function start() {
	const app = express();
	
	// CORS configuration for credentials
	app.use(cors({
		origin: process.env.FRONTEND_URL?.split(',') || "http://localhost:3000", 
		credentials: true
	}));
	
	app.use(cookieParser());
	app.use(express.json({ limit: "1mb" }));
	app.use(morgan("dev"));

	app.get("/api/health", (_req, res) => {
		res.json({ ok: true });
	});

	app.use("/api/products", productsRouter);
	app.post("/api/upload", uploadMultiple('files',cloudinaryConfig),(req:Request,res:any)=>{
res.status(200).json({urls:req.body.files.map((f: { url: any; })=>f.url)})
	});
	app.use("/api/orders", ordersRouter);
	app.use("/api/auth", authRouter);
	app.use("/api/categories", categoriesRouter);

	// Global error handler
	app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		if (err?.name === "ZodError") {
			return res.status(400).json({ error: "Validation error", details: err.issues });
		}
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	});

	await connectMongo();
	// await seedAll();

	app.listen(config.port, () => {
		console.log(`API server listening on http://localhost:${config.port}`);
	});
}

start().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
