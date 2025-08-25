import { Product } from "../models";
import { ProductCreateInput, ProductUpdateInput } from "../types";

export async function createProduct(input: ProductCreateInput) {
	const product = await Product.create({
		name: input.name,
		description: input.description ?? null,
		price_cents: input.price_cents,
		image_url: input.image_url ?? null,
		is_active: input.is_active ?? true,
	});
	return product.get({ plain: true });
}

export async function listProducts(activeOnly = true) {
	const where = activeOnly ? { is_active: true } : {};
	const products = await Product.findAll({ where, order: [["id", "DESC"]] });
	return products.map((p) => p.get({ plain: true }));
}

export async function getProductById(id: number) {
	const product = await Product.findByPk(id);
	return product ? product.get({ plain: true }) : undefined;
}

export async function updateProduct(id: number, input: ProductUpdateInput) {
	const product = await Product.findByPk(id);
	if (!product) return undefined;
	await product.update({
		name: input.name ?? product.name,
		description: input.description ?? product.getDataValue("description"),
		price_cents: input.price_cents ?? product.price_cents,
		image_url: input.image_url ?? product.getDataValue("image_url"),
		is_active: input.is_active ?? product.is_active,
	});
	return product.get({ plain: true });
}

export async function deleteProduct(id: number) {
	const count = await Product.destroy({ where: { id } });
	return count > 0;
}