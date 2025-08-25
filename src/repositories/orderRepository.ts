import { Order, OrderItem, sequelize } from "../models";
import { OrderCreateInput } from "../types";
import { Transaction } from "sequelize";

export async function createOrder(input: OrderCreateInput) {
	const total_cents = input.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
	return await sequelize.transaction(async (t: Transaction) => {
		const order = await Order.create(
			{
				user_name: input.user_name,
				user_email: input.user_email ?? null,
				user_phone: input.user_phone ?? null,
				contact_message: input.contact_message ?? null,
				total_cents,
				status: "submitted",
			},
			{ transaction: t }
		);
		await OrderItem.bulkCreate(
			input.items.map((i) => ({ order_id: order.id, product_id: i.product_id, quantity: i.quantity, price_cents: i.price_cents })),
			{ transaction: t }
		);
		return await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "items" }], transaction: t });
	});
}

export async function getOrderById(id: number) {
	const order = await Order.findByPk(id, { include: [{ model: OrderItem, as: "items" }] });
	return order ? (order.get({ plain: true }) as any) : undefined;
}

export async function listOrders(limit = 50) {
	const orders = await Order.findAll({
		order: [["id", "DESC"]],
		limit,
		include: [{ model: OrderItem, as: "items" }],
	});
	return orders.map((o) => o.get({ plain: true }) as any);
}