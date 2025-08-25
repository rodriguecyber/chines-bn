import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./db";

export { sequelize } from "./db";

// Product
export interface ProductAttributes {
	id: number;
	name: string;
	description?: string | null;
	price_cents: number;
	image_url?: string | null;
	is_active: boolean;
	created_at?: Date;
	updated_at?: Date;
}

type ProductCreationAttributes = Optional<ProductAttributes, "id" | "description" | "image_url" | "is_active" | "created_at" | "updated_at">;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
	declare id: number;
	declare name: string;
	declare description?: string | null;
	declare price_cents: number;
	declare image_url?: string | null;
	declare is_active: boolean;
	declare created_at?: Date;
	declare updated_at?: Date;
}

Product.init(
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		name: { type: DataTypes.STRING(255), allowNull: false },
		description: { type: DataTypes.TEXT, allowNull: true },
		price_cents: { type: DataTypes.INTEGER, allowNull: false },
		image_url: { type: DataTypes.STRING(2048), allowNull: true },
		is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
	},
	{ sequelize, tableName: "products", timestamps: true, underscored: true }
);

// Order
export interface OrderAttributes {
	id: number;
	user_name: string;
	user_email?: string | null;
	user_phone?: string | null;
	contact_message?: string | null;
	total_cents: number;
	status: string;
	created_at?: Date;
	updated_at?: Date;
}

type OrderCreationAttributes = Optional<OrderAttributes, "id" | "user_email" | "user_phone" | "contact_message" | "status" | "created_at" | "updated_at">;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
	declare id: number;
	declare user_name: string;
	declare user_email?: string | null;
	declare user_phone?: string | null;
	declare contact_message?: string | null;
	declare total_cents: number;
	declare status: string;
	declare created_at?: Date;
	declare updated_at?: Date;
}

Order.init(
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_name: { type: DataTypes.STRING(255), allowNull: false },
		user_email: { type: DataTypes.STRING(255), allowNull: true },
		user_phone: { type: DataTypes.STRING(50), allowNull: true },
		contact_message: { type: DataTypes.TEXT, allowNull: true },
		total_cents: { type: DataTypes.INTEGER, allowNull: false },
		status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "submitted" },
	},
	{ sequelize, tableName: "orders", timestamps: true, underscored: true }
);

// OrderItem
export interface OrderItemAttributes {
	id: number;
	order_id: number;
	product_id: number;
	quantity: number;
	price_cents: number;
	created_at?: Date;
	updated_at?: Date;
}

type OrderItemCreationAttributes = Optional<OrderItemAttributes, "id" | "created_at" | "updated_at">;

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
	declare id: number;
	declare order_id: number;
	declare product_id: number;
	declare quantity: number;
	declare price_cents: number;
	declare created_at?: Date;
	declare updated_at?: Date;
}

OrderItem.init(
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		order_id: { type: DataTypes.INTEGER, allowNull: false },
		product_id: { type: DataTypes.INTEGER, allowNull: false },
		quantity: { type: DataTypes.INTEGER, allowNull: false },
		price_cents: { type: DataTypes.INTEGER, allowNull: false },
	},
	{ sequelize, tableName: "order_items", timestamps: true, underscored: true }
);

// Associations
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

export const Models = { Product, Order, OrderItem };