import { Request, Response } from 'express';
import { Prisma, prisma } from '@digitalocean/product-db';

export const createCategory = async (req: Request, res: Response) => {
    const data: Prisma.CategoryCreateInput = req.body;
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
}

export const updateCategory = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: Prisma.CategoryUpdateInput = req.body;

    if(!id) {
        return res.status(400).json({ message: "Category ID is required" });
    }

    if(Array.isArray(id)) {
        return res.status(400).json({ message: "Category ID must be a single value" });
    }

    const category = await prisma.category.update({
        where: { id },
        data,
    });
    
    return res.status(200).json(category);
}

export const deleteCategory = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({ message: "Category ID is required" });
    }

    if(Array.isArray(id)) {
        return res.status(400).json({ message: "Category ID must be a single value" });
    }

    await prisma.category.delete({
        where: { id }
    });

    return res.status(200).json({ message: `Category with ID ${id} has been deleted` });
}

export const getCategory = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({ message: "Category ID is required" });
    }

    if(Array.isArray(id)) {
        return res.status(400).json({ message: "Category ID must be a single value" });
    }

    const category = await prisma.category.findUnique({
        where: { id },
        select: { name: true, slug: true, _count: { select: { products: true } } },
    });

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
}

export const getCategories = async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        where: { status: "ACTIVE" },
        orderBy: { sortOrder: "asc" },
        select: { name: true, slug: true, _count: { select: { products: true } } },
    });
    res.status(200).json(categories);
}