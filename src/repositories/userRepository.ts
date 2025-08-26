import { User } from "../models";
import bcrypt from "bcryptjs";

export type CreateUserInput = { email: string; password: string; role?: "admin" | "user" };

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export async function findUserByEmail(email: string) {
	const user = await User.findOne({ email }).lean();
	return user || undefined;
}

export async function findUserById(id: number) {
	const user = await User.findById(id).lean();
	return user || undefined;
}

export async function createUser(input: CreateUserInput) {
	const password_hash = await hashPassword(input.password);
	const user = await User.create({ email: input.email, password_hash, role: input.role ?? "admin" });
	return user.toObject();
}

