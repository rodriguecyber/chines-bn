import { Router } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";
import { LoginSchema } from "../types";
import { findUserByEmail, findUserById, verifyPassword } from "../repositories/userRepository";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
	try {
		const { email, password } = LoginSchema.parse(req.body);
		const user = await findUserByEmail(email);
		if (!user) return res.status(401).json({ error: "Invalid credentials" });
		const ok = await verifyPassword(password, (user as any).password_hash);
		if (!ok) return res.status(401).json({ error: "Invalid credentials" });
		
		const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as any };
		const token = jwt.sign({ sub: (user as any)._id, role: (user as any).role }, config.jwtSecret, signOptions);
		
		// Set HTTP-only cookie
		res.cookie("authToken", token, {
			httpOnly: true,
			secure: config.nodeEnv === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000, // 1 day
			path: "/"
		});
		
		res.json({ 
			token,
			user: {
				id: (user as any)._id,
				email: (user as any).email,
				role: (user as any).role
			}
		});
	} catch (e) { next(e); }
});

authRouter.post("/logout", (req, res) => {
	res.clearCookie("authToken", { path: "/" });
	res.json({ message: "Logged out successfully" });
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
	try {
		// This will be protected by auth middleware
		const user = await findUserById((req as any).user?.id);
		if (!user) return res.status(404).json({ error: "User not found" });
		
		res.json({
			id: (user as any)._id,
			email: (user as any).email,
			role: (user as any).role
		});
	} catch (e) { next(e); }
});

