"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

interface CartReviewProps {
	onNext: () => void;
}

export default function CartReview({ onNext }: CartReviewProps) {
	const { items, removeItem, updateQuantity, clearCart, totalPrice } =
		useCart();

	return (
		<div className="flex flex-col gap-4">
			{items.length === 0 && (
				<p className="py-12 text-center text-muted">Sepetiniz boş.</p>
			)}
			{items.map((item) => (
				<div
					key={item.product.id}
					className="flex gap-4 rounded-xl border border-border bg-background p-4"
				>
					{/* Image */}
					<div className="h-24 shrink-0 bg-border overflow-hidden">
						{item.product.images[0] && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={item.product.images[0]}
								alt={item.product.name}
								className="h-full w-full object-cover"
							/>
						)}
					</div>

					{/* Info */}
					<div className="flex flex-1 flex-col justify-between">
						<div>
							<p className="text-sm font-bold text-primary">
								{item.product.name}
							</p>
							<p className="mt-0.5 text-sm text-muted">
								₺{item.product.price.toFixed(2)}
							</p>
						</div>

						{/* Quantity & Remove */}
						<div className="mt-2 flex items-center gap-3">
							<div className="flex items-center gap-1">
								<button
									onClick={() =>
										updateQuantity(item.product.id, item.quantity - 1)
									}
									className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface hover:text-primary"
									aria-label="Miktarı azalt"
								>
									<Minus size={14} />
								</button>
								<span className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-primary">
									{item.quantity}
								</span>
								<button
									onClick={() =>
										updateQuantity(item.product.id, item.quantity + 1)
									}
									className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface hover:text-primary"
									aria-label="Miktarı artır"
								>
									<Plus size={14} />
								</button>
							</div>

							<button
								onClick={() => removeItem(item.product.id)}
								className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:text-red-500"
								aria-label="Ürünü kaldır"
							>
								<Trash2 size={16} />
							</button>
						</div>
					</div>

					{/* Line Total */}
					<div className="flex items-start">
						<p className="text-sm font-bold text-primary">
							₺{(item.product.price * item.quantity).toFixed(2)}
						</p>
					</div>
				</div>
			))}

			{/* Summary */}
			{items.length > 0 && (
				<div className="mt-4 rounded-xl border border-border bg-background p-6">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted">Toplam</span>
						<span className="text-2xl font-bold text-primary">
							₺{totalPrice.toFixed(2)}
						</span>
					</div>
					<div className="mt-6 flex flex-col gap-3 sm:flex-row">
						<Button onClick={onNext} className="flex-1">
							Adres Bilgilerine Geç
						</Button>
						<Button
							onClick={clearCart}
							variant="ghost"
							className="text-muted hover:text-red-500"
						>
							Sepeti Temizle
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
