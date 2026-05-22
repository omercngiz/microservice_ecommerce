import type { Request, Response } from 'express';
import { Prisma, prisma } from '@digitalocean/product-db';

export const createCategory = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: "Bu işleme yalnızca admin erişebilir." });
    }

    const data: Prisma.CategoryCreateInput = req.body;
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
}

export const updateCategory = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: "Bu işleme yalnızca admin erişebilir." });
    }

    const id = req.params.id as string;
    const data: Prisma.CategoryUpdateInput = req.body;

    const category = await prisma.category.update({
        where: { id },
        data,
    });
    
    return res.status(200).json(category);
}

export const deleteCategory = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: "Bu işleme yalnızca admin erişebilir." });
    }

    const id = req.params.id as string;

    await prisma.category.delete({
        where: { id }
    });

    return res.status(200).json({ message: `Category with ID ${id} has been deleted` });
}

export const getCategory = async (req: Request, res: Response) => {
    const id = req.params.id as string;

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