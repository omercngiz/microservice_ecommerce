import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ItemCard({ imageSrc }: { imageSrc?: string }) {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-md">
			<Image
				src={imageSrc || "https://picsum.photos/200/300"}
				alt="Item Image"
				width={400}
				height={300}
				className="h-48 w-full object-cover"
			/>
			<h3 className="text-lg font-semibold text-primary">Projelerimiz</h3>
			<p className="mt-2 text-sm text-muted">
				Çeşitli sektörlerde geliştirdiğimiz yenilikçi projelerimizi keşfedin.
			</p>
			<Link
				href="/projects"
				className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
			>
				İncele
				<ArrowRight size={16} />
			</Link>
		</div>
	);
}
