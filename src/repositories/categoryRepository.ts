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

export async function getCategoryById(id: string) {
	const cat = await Category.findOne({ _id:id }).lean();
	return cat || undefined;
}

export async function updateCategory(id: string, input: CategoryUpdateInput) {
	const updated = await Category.findOneAndUpdate(
		{ _id:id },
		{ $set: { ...(input.name ? { name: input.name } : {}), ...(input.description ? { description: input.description } : {}) } },
		{ new: true }
	).lean();
	return updated || undefined;
}

export async function deleteCategory(id: string) {
	const res = await Category.deleteOne({ _id:id });
	return res.deletedCount === 1;
}