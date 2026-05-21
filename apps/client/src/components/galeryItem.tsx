"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart, type CartProduct } from "@/context/cart-context";

export default function GaleryItem({ product }: { product: CartProduct }) {
	const { addItem } = useCart();

	return (
		<div className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md cursor-pointer">
			<Link
				href={`/store/${product.slug}`}
				className="relative overflow-hidden bg-surface"
			>
				<Image
					src={product.images[0] || "/besmele.png"}
					alt={product.name}
					className="object-cover transition-transform duration-300"
					width={1280}
					height={720}
					priority
				/>
			</Link>

			<div className="flex flex-1 flex-col gap-2 p-3">
				<Link href={`/store/${product.slug}`} className="flex-1">
					<p className="text-sm font-semibold leading-snug text-primary line-clamp-2 hover:text-accent transition-colors">
						{product.name}
					</p>
					<p className="mt-1 text-sm font-bold text-accent">
						₺{product.price.toFixed(2)}
					</p>
				</Link>

				<button
					onClick={() => addItem(product)}
					className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
				>
					<ShoppingCart size={14} />
					Sepete Ekle
				</button>
			</div>
		</div>
	);
}
