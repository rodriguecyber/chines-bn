import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../middleware/auth";
import { CategoryCreateSchema, CategoryUpdateSchema } from "../types";
import { createCategory, deleteCategory, getCategoryById, listCategories, updateCategory } from "../repositories/categoryRepository";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res, next) => {
	try {
		const cats = await listCategories();
		res.json(cats);
	} catch (e) { next(e); }
});

categoriesRouter.get("/:id", async (req, res, next) => {
	try {
		const id = z.coerce.number().int().positive().parse(req.params.id);
		const cat = await getCategoryById(id);
		if (!cat) return res.status(404).json({ error: "Category not found" });
		res.json(cat);
	} catch (e) { next(e); }
});

categoriesRouter.post("/", requireAdmin, async (req, res, next) => {
	try {
		const input = CategoryCreateSchema.parse(req.body);
		const cat = await createCategory(input);
		res.status(201).json(cat);
	} catch (e) { next(e); }
});

categoriesRouter.put("/:id", requireAdmin, async (req, res, next) => {
	try {
		const id = z.coerce.number().int().positive().parse(req.params.id);
		const input = CategoryUpdateSchema.parse(req.body);
		const cat = await updateCategory(id, input);
		if (!cat) return res.status(404).json({ error: "Category not found" });
		res.json(cat);
	} catch (e) { next(e); }
});

categoriesRouter.delete("/:id", requireAdmin, async (req, res, next) => {
	try {
		const id = z.coerce.number().int().positive().parse(req.params.id);
		const ok = await deleteCategory(id);
		if (!ok) return res.status(404).json({ error: "Category not found" });
		res.status(204).send();
	} catch (e) { next(e); }
});

