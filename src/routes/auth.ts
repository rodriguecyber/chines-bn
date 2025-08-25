import { Router } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";
import { LoginSchema } from "../types";
import { findUserByEmail, verifyPassword } from "../repositories/userRepository";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
	try {
		const { email, password } = LoginSchema.parse(req.body);
		const user = await findUserByEmail(email);
		if (!user) return res.status(401).json({ error: "Invalid credentials" });
		const ok = await verifyPassword(password, (user as any).password_hash);
		if (!ok) return res.status(401).json({ error: "Invalid credentials" });
		const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as any };
		const token = jwt.sign({ sub: (user as any).id, role: (user as any).role }, config.jwtSecret, signOptions);
		res.json({ token });
	} catch (e) { next(e); }
});

