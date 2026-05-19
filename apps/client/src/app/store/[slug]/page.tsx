import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductDetail } from "@/components/store/product-detail";
import type { CartProduct } from "@/context/cart-context";

interface PageProps {
	params: Promise<{ slug: string }>;
}

interface ProductResponse extends CartProduct {
	description: string;
}

async function getProductBySlug(slug: string): Promise<ProductResponse | null> {
	try {
		const res = await fetch(`http://localhost:8000/products/slug/${slug}`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = await getProductBySlug(slug);
	if (!product) return {};

	return {
		title: `${product.name} — Mağaza`,
		description: product.description,
	};
}

export default async function ProductPage({ params }: PageProps) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	return (
		<>
			{/* Breadcrumb */}
			<section className="border-b border-border">
				<div className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 py-4 text-sm text-muted">
					<Link href="/" className="transition-colors hover:text-primary">
						Mağaza
					</Link>
					<ChevronRight size={14} className="shrink-0" />
					<span className="truncate text-primary">{product.name}</span>
				</div>
			</section>

			{/* Product Detail */}
			<section className="border-t border-border">
				<div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
					<ProductDetail product={product} />
				</div>
			</section>
		</>
	);
}
