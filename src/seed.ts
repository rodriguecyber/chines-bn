import { config } from "./config";
import { User } from "./models";
import { createUser } from "./repositories/userRepository";

export async function seedInitialAdmin(): Promise<void> {
	const email = config.seedAdminEmail;
	const existing = await User.findOne({ where: { email } });
	if (existing) return;
	await createUser({ email, password: config.seedAdminPassword, role: "admin" });
}

