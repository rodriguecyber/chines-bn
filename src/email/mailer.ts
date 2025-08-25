import nodemailer from "nodemailer";
import { config } from "../config";

export type OrderForMail = {
	id: number;
	user_name: string;
	user_email?: string | null;
	user_phone?: string | null;
	contact_message?: string | null;
	total_cents: number;
	items: Array<{ product_id: number; quantity: number; price_cents: number }>;
};

let transporter: nodemailer.Transporter<any>;

if (config.smtpHost) {
	transporter = nodemailer.createTransport({
		host: config.smtpHost,
		port: config.smtpPort ?? 587,
		secure: (config.smtpPort ?? 587) === 465,
		auth: config.smtpUser && config.smtpPass ? { user: config.smtpUser, pass: config.smtpPass } : undefined,
	});
} else {
	transporter = nodemailer.createTransport({ jsonTransport: true } as any);
}

export async function sendOrderNotifications(order: OrderForMail): Promise<void> {
	const subject = `New order #${order.id} - ${order.user_name}`;
	const plain = [
		`Order ID: ${order.id}`,
		`Name: ${order.user_name}`,
		order.user_email ? `Email: ${order.user_email}` : undefined,
		order.user_phone ? `Phone: ${order.user_phone}` : undefined,
		order.contact_message ? `Message: ${order.contact_message}` : undefined,
		`Total: $${(order.total_cents / 100).toFixed(2)}`,
		"Items:",
		...order.items.map((i) => ` - product ${i.product_id} x${i.quantity} @ $${(i.price_cents / 100).toFixed(2)}`),
	]
		.filter(Boolean)
		.join("\n");

	const from = config.smtpFrom ?? config.smtpUser ?? "no-reply@example.com";

	const messages: nodemailer.SendMailOptions[] = [];
	if (config.adminEmail) {
		messages.push({ from, to: config.adminEmail, subject, text: plain });
	}
	if (order.user_email) {
		messages.push({ from, to: order.user_email, subject: `We received your order #${order.id}`, text: plain });
	}

	for (const msg of messages) {
		await transporter.sendMail(msg);
	}
}