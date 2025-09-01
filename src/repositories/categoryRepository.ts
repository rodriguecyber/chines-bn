import { Category } from "../models";
import { CategoryCreateInput, CategoryUpdateInput } from "../types";
import { getNextSequence } from "./sequence";

export async function createCategory(input: CategoryCreateInput) {
	const nextId = await getNextSequence("categories");
	const cat = await Category.create({ id: nextId, name: input.name, description: input.description });
	return cat.toObject();
}

export async function listCategories() {
	return await Category.find().sort({ _id: 1 }).lean();
}

export async function getCategoryById(id: number) {
	const cat = await Category.findOne({ id }).lean();
	return cat || undefined;
}

export async function updateCategory(id: number, input: CategoryUpdateInput) {
	const updated = await Category.findOneAndUpdate(
		{ id },
		{ $set: { ...(input.name ? { name: input.name } : {}), ...(input.description ? { description: input.description } : {}) } },
		{ new: true }
	).lean();
	return updated || undefined;
}

export async function deleteCategory(id: number) {
	const res = await Category.deleteOne({ id });
	return res.deletedCount === 1;
}