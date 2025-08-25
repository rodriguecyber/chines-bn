import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import { connectMongo } from "./db";
import "./models";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { authRouter } from "./routes/auth";
import { seedInitialAdmin } from "./seed";

async function start() {
	const app = express();
	app.use(cors());
	app.use(express.json({ limit: "1mb" }));
	app.use(morgan("dev"));

	app.get("/api/health", (_req, res) => {
		res.json({ ok: true });
	});

	app.use("/api/products", productsRouter);
	app.use("/api/orders", ordersRouter);
	app.use("/api/auth", authRouter);

	// Global error handler
	app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		if (err?.name === "ZodError") {
			return res.status(400).json({ error: "Validation error", details: err.issues });
		}
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	});

	await connectMongo();
	await seedInitialAdmin();

	app.listen(config.port, () => {
		console.log(`API server listening on http://localhost:${config.port}`);
	});
}

start().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});