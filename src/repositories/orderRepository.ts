import { Order } from "../models";
import { OrderCreateInput } from "../types";
import { getNextSequence } from "./sequence";

export async function createOrder(input: OrderCreateInput) {
	// const total_cents = input.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
	const nextId = await getNextSequence("orders");
	const order = await Order.create({
		id: nextId,
		user_name: input.customerName,
		user_email: input.customerEmail ?? null,
		// user_phone: input. ?? null,
		// contact_message: input. ?? null,
		// total_cents,
		status: "submitted",
		items: input.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, image_url: i.image_url })),
	});
	return order.toObject();
}

export async function getOrderById(id: number) {
	const order = await Order.findOne({ id }).lean().populate('items.product_id');
	return order || undefined;
}

export async function listOrders(limit = 50) {
	const orders = await Order.find().sort({ id: -1 }).limit(limit).lean().populate('items.product_id');
	return orders;
}