import { mongoose } from "./db";

const { Schema, model } = mongoose;

// User
export interface UserDoc {
	_id: string;
	email: string;
	password_hash: string;
	role: "admin" | "user";
	createdAt?: Date;
	updatedAt?: Date;
}

const UserSchema = new Schema<UserDoc>(
	{
		email: { type: String, required: true, unique: true, index: true },
		password_hash: { type: String, required: true },
		role: { type: String, enum: ["admin", "user"], default: "admin" },
	},
	{ timestamps: true }
);

export const User = model<UserDoc>("User", UserSchema);

// Product
export interface ProductDoc {
	_id: string;
	id: number; // stable numeric id for API
	name: string;
	description?: string | null;
	price_cents: number;
	image_url?: string | null;
	is_active: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const ProductSchema = new Schema<ProductDoc>(
	{
		id: { type: Number, required: true, unique: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		price_cents: { type: Number, required: true },
		image_url: { type: String },
		is_active: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export const Product = model<ProductDoc>("Product", ProductSchema);

// Order
export interface OrderItemEmbedded {
	product_id: number;
	quantity: number;
	price_cents: number;
}

export interface OrderDoc {
	_id: string;
	id: number; // stable numeric id for API
	user_name: string;
	user_email?: string | null;
	user_phone?: string | null;
	contact_message?: string | null;
	total_cents: number;
	status: string;
	items: OrderItemEmbedded[];
	createdAt?: Date;
	updatedAt?: Date;
}

const OrderItemSchema = new Schema<OrderItemEmbedded>(
	{
		product_id: { type: Number, required: true },
		quantity: { type: Number, required: true },
		price_cents: { type: Number, required: true },
	},
	{ _id: false }
);

const OrderSchema = new Schema<OrderDoc>(
	{
		id: { type: Number, required: true, unique: true, index: true },
		user_name: { type: String, required: true },
		user_email: { type: String },
		user_phone: { type: String },
		contact_message: { type: String },
		total_cents: { type: Number, required: true },
		status: { type: String, default: "submitted" },
		items: { type: [OrderItemSchema], required: true },
	},
	{ timestamps: true }
);

export const Order = model<OrderDoc>("Order", OrderSchema);

export const Models = { User, Product, Order };