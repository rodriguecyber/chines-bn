import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthRequest extends Request {
	user?: { id: number; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const header = req.headers["authorization"];
	if (!header || !header.toString().startsWith("Bearer ")) {
		return res.status(401).json({ error: "Missing or invalid Authorization header" });
	}
	const token = header.toString().slice(7);
	try {
		const payload = jwt.verify(token, config.jwtSecret) as any;
		req.user = { id: payload.sub, role: payload.role };
		next();
	} catch (e) {
		return res.status(401).json({ error: "Invalid token" });
	}
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
	requireAuth(req, res, (err?: any) => {
		if (err) return next(err);
		if (!req.user || req.user.role !== "admin") {
			return res.status(403).json({ error: "Admin access required" });
		}
		next();
	});
}

