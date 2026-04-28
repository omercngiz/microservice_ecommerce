import { Request, Response } from 'express';
import { Prisma, prisma } from '@digitalocean/product-db';
import { producer } from '../utils/kafka';

export const createProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const items: Prisma.ProductCreateInput[] = Array.isArray(body) ? body : [body];

    for (const item of items) {
        if (!item.name || !item.slug || !item.description || item.price == null) {
            return res.status(400).json({ message: "name, slug, description and price are required for every product" });
        }
    }

    if (items.length === 1) {
        const product = await prisma.product.create({ data: items[0]! });
        return res.status(201).json(product);
    }

    const products = await prisma.$transaction(
        items.map((data) => prisma.product.create({ data }))
    );

    producer.send({
        topic: 'product-created',
        
    res.status(201).json(products);
}

export const updateProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: Prisma.ProductUpdateInput = req.body;

    if(!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    if(Array.isArray(id)) {
        return res.status(400).json({ message: "Product ID must be a single value" });
    }

    const product = await prisma.product.update({
        where: { id },
        data,
    });
    
    return res.status(200).json(product);
}

export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    if(Array.isArray(id)) {
        return res.status(400).json({ message: "Product ID must be a single value" });
    }

    await prisma.product.delete({
        where: { id }
    });

    return res.status(200).json({ message: `Product with ID ${id} has been deleted` });
}

export const getProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    
    if(!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    if(Array.isArray(id)) {
        return res.status(400).json({ message: "Product ID must be a single value" });
    }
    
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
}

export const getProducts = async (req: Request, res: Response) => {
    const { sort, category, search, limit } = req.query;

    const orderBy = (() => {
        switch (sort) {
            case "asc":
                return { price: Prisma.SortOrder.asc };
            case "desc":
                return { price: Prisma.SortOrder.desc };
            case "oldest":
                return { createdAt: Prisma.SortOrder.asc };
            default:
                return { createdAt: Prisma.SortOrder.desc };
        }
    })();

    const products = await prisma.product.findMany({
        where: {
            status: "ACTIVE",
            ...(category && {
                category: {
                    slug: category as string
                }
            }),
            ...(search && {
                OR: [
                    { name: { 
                        contains: search as string, 
                        mode: "insensitive" 
                    } },
                    { description: { 
                        contains: search as string, 
                        mode: "insensitive" 
                    } },
                ],
            }),
        },
        orderBy,
        take: limit ? Number(limit) : undefined,
        include: { category: true },
    });
    return res.status(200).json(products);
}