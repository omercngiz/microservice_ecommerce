import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Link
			href={`/store/${product.slug}`}
			className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-md"
		>
			<div className="relative aspect-square overflow-hidden bg-surface">
				<Image
					src={product.images[0]!}
					alt={product.name}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-105"
					sizes="(max-width: 640px) 100vw, 50vw"
				/>
			</div>
			<div className="p-5">
				<h3 className="text-sm font-bold text-primary">{product.name}</h3>
				<p className="mt-1.5 line-clamp-2 text-sm text-muted">
					{product.description}
				</p>
				<p className="mt-3 text-lg font-bold text-primary">₺{product.price}</p>
			</div>
		</Link>
	);
}
