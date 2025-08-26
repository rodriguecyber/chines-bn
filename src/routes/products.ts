import { Router } from "express";
import { z } from "zod";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../repositories/productRepository";
import { ProductCreateSchema, ProductUpdateSchema } from "../types";
import { requireAdmin } from "../middleware/auth";

export const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
	try {
		const includeInactive = req.query.all === "true";
		const categoryId = req.query.categoryId ? z.coerce.number().int().parse(req.query.categoryId) : undefined;
		const products = await listProducts(!includeInactive, categoryId);
		res.json(products);
	} catch (e) { next(e); }
});

productsRouter.get("/:id", async (req, res, next) => {
	try {
		const id = z.coerce.number().int().parse(req.params.id);
		const product = await getProductById(id);
		if (!product) return res.status(404).json({ error: "Product not found" });
		res.json(product);
	} catch (e) { next(e); } 
});

productsRouter.post("/", requireAdmin, async (req, res, next) => {
	try {
		const input = ProductCreateSchema.parse(req.body);
		const product = await createProduct(input);
		res.status(201).json(product);
	} catch (e) { next(e); }
});

productsRouter.patch("/:id", requireAdmin, async (req, res, next) => {
	try {
		const id = z.coerce.number().int().parse(req.params.id);
		const input = ProductUpdateSchema.parse(req.body);
		const product = await updateProduct(id, input);
		if (!product) return res.status(404).json({ error: "Product not found" });
		res.json(product);
	} catch (e) { next(e); }
});

productsRouter.put("/:id", requireAdmin, async (req, res, next) => {
	try {
		const id = z.coerce.number().int().parse(req.params.id);
		const input = ProductCreateSchema.parse(req.body);
		const product = await updateProduct(id, input);
		if (!product) return res.status(404).json({ error: "Product not found" });
		res.json(product);
	} catch (e) { next(e); }
});

productsRouter.delete("/:id", requireAdmin, async (req, res, next) => {
	try {
		const id = z.coerce.number().int().parse(req.params.id);
		const ok = await deleteProduct(id);
		if (!ok) return res.status(404).json({ error: "Product not found" });
		res.status(204).send();
	} catch (e) { next(e); }
});