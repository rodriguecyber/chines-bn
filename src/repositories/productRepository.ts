import { Product } from "../models";
import { ProductCreateInput, ProductUpdateInput } from "../types";
import { getNextSequence } from "./sequence";

export async function createProduct(input: ProductCreateInput) {
	const nextId = await getNextSequence("products");
	const doc = await Product.create({
		id: nextId,
		name: input.name,
		description: input.description,
		// price_cents: input.price_cents,
		image_url: input.image_url ?? null,
		is_active: input.is_active ?? true,
		category_id: input.category_id, 
	});
	return doc.toObject();
}

export async function listProducts(activeOnly = true, categoryId?: string) {
	const where: any = {};
	if (activeOnly) where.is_active = true;
	if (categoryId !== undefined) where.category_id = categoryId;
	
	const products = await Product.find(where).populate('category_id').sort({ _id: -1 }).lean();
	return products;
}

export async function getProductById(id: string) {
	const product = await Product.findById(id).lean();
	return product || undefined;
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
	const updated = await Product.findByIdAndUpdate(
		 id ,
		{
			$set: {
				...(input.name !== undefined ? { name: input.name } : {}),
				...(input.description !== undefined ? { description: input.description } : {}),
				// ...(input.price_cents !== undefined ? { price_cents: input.price_cents } : {}),
				...(input.image_url !== undefined ? { image_url: input.image_url } : {}),
				...(input.is_active !== undefined ? { is_active: input.is_active } : {}),
				...(input.category_id !== undefined ? { category_id: input.category_id } : {}),
			},
		},
		{ new: true }
	).lean();
	return updated || undefined;
}

export async function deleteProduct(id: string) {
	const res = await Product.deleteOne({ _id:id });
	return res.deletedCount === 1;
}