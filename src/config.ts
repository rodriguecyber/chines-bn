import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
	nodeEnv: z.string().default("development"),
	port: z.coerce.number().default(4000),
	// PostgreSQL
	databaseUrl: z.string().optional(),
	pgHost: z.string().optional(),
	pgPort: z.coerce.number().optional(),
	pgUser: z.string().optional(),
	pgPassword: z.string().optional(),
	pgDatabase: z.string().optional(),
	pgSsl: z
		.union([z.string(), z.boolean()])
		.optional()
		.transform((v) => (typeof v === "string" ? v === "true" : v))
		.pipe(z.boolean().default(false)),
	// Mail
	smtpHost: z.string().optional(),
	smtpPort: z.coerce.number().optional(),
	smtpUser: z.string().optional(),
	smtpPass: z.string().optional(),
	smtpFrom: z.string().optional(),
	adminEmail: z.string().email().optional(),
	// Auth / JWT
	jwtSecret: z.string().min(16, "JWT_SECRET must be at least 16 characters").default("dev-secret-change-me"),
	jwtExpiresIn: z.union([z.string(), z.coerce.number()]).default("1d"),
	// Seeding
	seedAdminEmail: z.string().email().default("admin@example.com"),
	seedAdminPassword: z.string().min(6).default("admin123"),
});

const raw = {
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT,
	// PG
	databaseUrl: process.env.DATABASE_URL,
	pgHost: process.env.PGHOST,
	pgPort: process.env.PGPORT,
	pgUser: process.env.PGUSER,
	pgPassword: process.env.PGPASSWORD,
	pgDatabase: process.env.PGDATABASE,
	pgSsl: process.env.PGSSL,
	// Mail
	smtpHost: process.env.SMTP_HOST,
	smtpPort: process.env.SMTP_PORT,
	smtpUser: process.env.SMTP_USER,
	smtpPass: process.env.SMTP_PASS,
	smtpFrom: process.env.SMTP_FROM,
	adminEmail: process.env.ADMIN_EMAIL,
	// Auth / JWT
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiresIn: process.env.JWT_EXPIRES_IN,
	// Seeding
	seedAdminEmail: process.env.SEED_ADMIN_EMAIL,
	seedAdminPassword: process.env.SEED_ADMIN_PASSWORD,
};

export type AppConfig = z.infer<typeof EnvSchema>;

export const config: AppConfig = EnvSchema.parse(raw);