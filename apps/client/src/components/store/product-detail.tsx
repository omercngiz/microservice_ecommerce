"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart, type CartProduct } from "@/context/cart-context";

interface ProductDetailProps {
	product: CartProduct & { description?: string };
}

export function ProductDetail({ product }: ProductDetailProps) {
	const [activeImage, setActiveImage] = useState(0);
	const [added, setAdded] = useState(false);
	const { addItem } = useCart();

	function handleAddToCart() {
		addItem(product);
		setAdded(true);
		setTimeout(() => setAdded(false), 2000);
	}

	return (
		<div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
			{/* Left — Image Gallery */}
			<div className="lg:w-1/2">
				<div className="relative overflow-hidden rounded-xl border border-border bg-surface">
					<Image
						src={product.images[activeImage] || "/besmele.png"}
						alt={product.name}
						className="object-cover"
						width={1280}
						height={720}
						priority
					/>
				</div>
				{product.images.length > 1 && (
					<div className="mt-3 flex gap-3">
						{product.images.map((image, index) => (
							<button
								key={index}
								onClick={() => setActiveImage(index)}
								className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
									activeImage === index
										? "border-accent"
										: "border-border hover:border-muted"
								}`}
							>
								<Image
									src={image}
									alt={`${product.name} — ${index + 1}`}
									width={80}
									height={80}
									className="object-cover"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Right — Product Info */}
			<div className="lg:w-1/2">
				<h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
					{product.name}
				</h1>
				<p className="mt-2 text-2xl font-bold text-accent">
					₺{product.price.toFixed(2)}
				</p>
				{product.description && (
					<p className="mt-4 text-[15px] leading-relaxed text-muted">
						{product.description}
					</p>
				)}

				{/* Add to Cart */}
				<Button
					onClick={handleAddToCart}
					disabled={added}
					size="lg"
					className="mt-8 w-full sm:w-auto"
				>
					{added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
				</Button>
			</div>
		</div>
	);
}
