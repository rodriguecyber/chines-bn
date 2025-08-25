import { Sequelize } from "sequelize";
import { config } from "./config";

export const sequelize = new Sequelize(
	config.databaseUrl || '',
	config.databaseUrl
		? {
			dialect: "postgres",
			logging: false,
			dialectOptions: config.pgSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
		}
		: {
			dialect: "postgres",
			host: config.pgHost || "localhost",
			port: config.pgPort || 5432,
			database: config.pgDatabase || "app",
			username: config.pgUser || "postgres",
			password: config.pgPassword || "",
			logging: false,
			dialectOptions: config.pgSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
		}
);