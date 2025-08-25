import { z } from "zod";

export const ProductCreateSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	price_cents: z.number().int().nonnegative(),
	image_url: z.string().url().optional(),
	is_active: z.boolean().optional().default(true),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;

export const OrderItemSchema = z.object({
	product_id: z.number().int().positive(),
	quantity: z.number().int().positive(),
	price_cents: z.number().int().nonnegative(),
});

export const OrderCreateSchema = z.object({
	user_name: z.string().min(1),
	user_email: z.string().email().optional(),
	user_phone: z.string().optional(),
	contact_message: z.string().optional(),
	items: z.array(OrderItemSchema).min(1),
});

export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;

// Auth
export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginSchema>;