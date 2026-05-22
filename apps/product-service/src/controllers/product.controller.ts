import type { Request, Response } from 'express';
import { Prisma, prisma } from '@digitalocean/product-db';
import { producer } from '../utils/kafka';

export const createProduct = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: "Bu işleme yalnızca admin erişebilir." });
    }

    const body = req.body;
    const items: Prisma.ProductCreateInput[] = Array.isArray(body) ? body : [body];

    for (const item of items) {
        if (!item.name || !item.slug || !item.description || item.price == null) {
            return res.status(400).json({ message: "name, slug, description and price are required for every product" });
        }
    }

    if (items.length === 1) {
        const product = await prisma.product.create({ data: items[0]! });
        producer.send("product.created", { value: product });

        return res.status(201).json(product);
    }

    const products = await prisma.product.createMany({ data: items });

    producer.send("product.created", { value: products });

    res.status(201).json(products);
}

export const updateProduct = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: "Bu işleme yalnızca admin erişebilir." });
    }

    const id = req.params.id as string;
    const data: Prisma.ProductUpdateInput = req.body;

    const product = await prisma.product.update({
        where: { id },
        data,
    });
    
    return res.status(200).json(product);
}

export const deleteProduct = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: "Bu işleme yalnızca admin erişebilir." });
    }

    const id = req.params.id as string;

    await prisma.product.delete({
        where: { id }
    });

    producer.send("product.deleted", { value: id });

    return res.status(200).json({ message: `Product with ID ${id} has been deleted` });
}

export const getProductBySlug = async (req: Request, res: Response) => {
    const slug = req.params.slug as string;

    const product = await prisma.product.findUnique({
        where: { slug },
        select: {
            id: true,
            stripeProductId: true,
            name: true,
            price: true,
            slug: true,
            description: true,
            images: true,
            category: {
                select: {
                    name: true,
                    slug: true,
                }
            }
        }
    });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
}

export const getProduct = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            stripeProductId: true,
            name: true,
            price: true,
            slug: true,
            description: true,
            images: true,
            category: {
                select: {
                    name: true,
                    slug: true,
                }
            }
        }
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
        select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            images: true,
            stripeProductId: true,
            category: {
                select: {
                    name: true,
                    slug: true,
                }
            }
        },
        orderBy,
        take: limit ? Number(limit) : undefined,
    });
    return res.status(200).json(products);
}