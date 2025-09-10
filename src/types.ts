import { z } from "zod";

const LocalizedStringSchema = z.object({
	en: z.string().min(1),
	fr: z.string().min(1),
	zh: z.string().min(1),
});

export const CategoryCreateSchema = z.object({
	name: LocalizedStringSchema,
	description: LocalizedStringSchema,
});
export const CategoryUpdateSchema = CategoryCreateSchema.partial();
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;

export const ProductCreateSchema = z.object({
	name: LocalizedStringSchema,
	description: LocalizedStringSchema,
	// price_cents: z.number().int().nonnegative(),
	image_url: z.array(z.string().url().optional()),
	is_active: z.boolean().optional().default(true),
	category_id: z.string().min(1), // Reference to Category _id
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;

export const OrderItemSchema = z.object({
	product_id: z.number().int().positive(),
	quantity: z.number().int().positive(),
	// price_cents: z.number().int().nonnegative(),
});

export const OrderCreateSchema = z.object({
	customerNAme: z.string().min(1),
	customerEmail: z.string().email().optional(),
	// customerPhone: z.string().optional(),
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