import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthRequest extends Request {
	user?: { id: string; role: string };
}

function extractToken(req: Request): string | null {
	// First try to get token from cookies
	const cookieToken = req.cookies?.authToken;
	if (cookieToken) return cookieToken;
	
	// Fallback to Authorization header
	const header = req.headers["authorization"];
	if (header && header.toString().startsWith("Bearer ")) {
		return header.toString().slice(7);
	}
	
	return null;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const token = extractToken(req);
	if (!token) {
		return res.status(401).json({ error: "Authentication required" });
	}
	
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

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const token = extractToken(req);
	if (!token) {
		req.user = undefined;
		return next();
	}
	
	try {
		const payload = jwt.verify(token, config.jwtSecret) as any;
		req.user = { id: payload.sub, role: payload.role };
		next();
	} catch (e) {
		req.user = undefined;
		next();
	}
}

