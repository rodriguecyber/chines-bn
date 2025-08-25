import { Router } from "express";
import { z } from "zod";
import { createOrder, getOrderById, listOrders } from "../repositories/orderRepository";
import { OrderCreateSchema } from "../types";
import { sendOrderNotifications } from "../email/mailer";

export const ordersRouter = Router();

ordersRouter.post("/", async (req, res, next) => {
	try {
		const input = OrderCreateSchema.parse(req.body);
		const order = await createOrder(input);
		if (!order) return res.status(500).json({ error: "Could not create order" });
		await sendOrderNotifications(order as any);
		res.status(201).json({ id: (order as any).id });
	} catch (err) {
		next(err);
	}
});

ordersRouter.get("/:id", async (req, res, next) => {
	try {
		const id = z.coerce.number().int().parse(req.params.id);
		const order = await getOrderById(id);
		if (!order) return res.status(404).json({ error: "Order not found" });
		res.json(order);
	} catch (e) { next(e); }
});

ordersRouter.get("/", async (req, res, next) => {
	try {
		const limit = z.coerce.number().int().positive().max(500).default(50).parse(req.query.limit ?? "50");
		const orders = await listOrders(limit);
		res.json(orders);
	} catch (e) { next(e); }
});