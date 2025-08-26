import { Order } from "../models";
import { OrderCreateInput } from "../types";
import { getNextSequence } from "./sequence";

export async function createOrder(input: OrderCreateInput) {
	const total_cents = input.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
	const nextId = await getNextSequence("orders");
	const order = await Order.create({
		id: nextId,
		user_name: input.user_name,
		user_email: input.user_email ?? null,
		user_phone: input.user_phone ?? null,
		contact_message: input.contact_message ?? null,
		total_cents,
		status: "submitted",
		items: input.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, price_cents: i.price_cents })),
	});
	return order.toObject();
}

export async function getOrderById(id: number) {
	const order = await Order.findOne({ id }).lean();
	return order || undefined;
}

export async function listOrders(limit = 50) {
	const orders = await Order.find().sort({ id: -1 }).limit(limit).lean();
	return orders;
}