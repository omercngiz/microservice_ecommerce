"use client";

import { useState } from "react";
import {
	Package,
	ShoppingBag,
	Clock,
	CheckCircle,
	Wallet,
	Plus,
	Pencil,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
	{
		label: "Toplam Bakiye",
		value: "₺12.450,00",
		icon: Wallet,
		color: "text-accent",
	},
	{
		label: "Bekleyen Siparişler",
		value: "8",
		icon: Clock,
		color: "text-yellow-500",
	},
	{
		label: "Tamamlanan Siparişler",
		value: "134",
		icon: CheckCircle,
		color: "text-green-500",
	},
	{
		label: "Toplam Satış",
		value: "₺89.200,00",
		icon: TrendingUp,
		color: "text-accent",
	},
];

const PLACEHOLDER_PRODUCTS = [
	{
		id: "1",
		name: "Besmele — Sülüs",
		category: "Sülüs",
		price: "₺1.200,00",
		stock: 3,
		status: "Aktif",
	},
	{
		id: "2",
		name: "Kelime-i Tevhid",
		category: "Celi Sülüs",
		price: "₺2.800,00",
		stock: 1,
		status: "Aktif",
	},
	{
		id: "3",
		name: "Elif Ba Ta",
		category: "Kufi",
		price: "₺950,00",
		stock: 0,
		status: "Taslak",
	},
];

const PLACEHOLDER_ORDERS = [
	{
		id: "#1042",
		customer: "Ahmet Y.",
		product: "Besmele — Sülüs",
		date: "18 May 2026",
		total: "₺1.200,00",
		status: "Bekliyor",
	},
	{
		id: "#1041",
		customer: "Fatma K.",
		product: "Kelime-i Tevhid",
		date: "17 May 2026",
		total: "₺2.800,00",
		status: "Bekliyor",
	},
	{
		id: "#1038",
		customer: "Mehmet A.",
		product: "Elif Ba Ta",
		date: "15 May 2026",
		total: "₺950,00",
		status: "Tamamlandı",
	},
	{
		id: "#1035",
		customer: "Zeynep S.",
		product: "Besmele — Sülüs",
		date: "12 May 2026",
		total: "₺1.200,00",
		status: "Tamamlandı",
	},
];

type Tab = "products" | "orders";

export default function SellerPage() {
	const [activeTab, setActiveTab] = useState<Tab>("products");

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
			{/* Header */}
			<div className="mb-8 flex flex-col gap-1">
				<h1 className="text-3xl font-bold tracking-tight text-primary">
					Satıcı Paneli
				</h1>
				<p className="text-sm text-muted">
					Ürünlerinizi ve siparişlerinizi yönetin.
				</p>
			</div>

			{/* Stats */}
			<div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{STATS.map((stat) => (
					<div
						key={stat.label}
						className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5"
					>
						<div className={`w-fit rounded-lg bg-surface p-2 ${stat.color}`}>
							<stat.icon size={20} />
						</div>
						<div>
							<p className="text-xs text-muted">{stat.label}</p>
							<p className="mt-0.5 text-xl font-bold text-primary">
								{stat.value}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className="mb-6 flex gap-1 rounded-xl border border-border bg-surface p-1 w-fit">
				<button
					onClick={() => setActiveTab("products")}
					className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
						activeTab === "products"
							? "bg-background text-primary shadow-sm"
							: "text-muted hover:text-primary"
					}`}
				>
					<Package size={15} />
					Ürünler
				</button>
				<button
					onClick={() => setActiveTab("orders")}
					className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
						activeTab === "orders"
							? "bg-background text-primary shadow-sm"
							: "text-muted hover:text-primary"
					}`}
				>
					<ShoppingBag size={15} />
					Siparişler
				</button>
			</div>

			{/* Products Tab */}
			{activeTab === "products" && (
				<div className="rounded-xl border border-border bg-background">
					<div className="flex items-center justify-between border-b border-border px-6 py-4">
						<h2 className="font-semibold text-primary">Ürünlerim</h2>
						<Button size="sm" className="flex items-center gap-2">
							<Plus size={14} />
							Ürün Ekle
						</Button>
					</div>
					<div className="divide-y divide-border">
						{PLACEHOLDER_PRODUCTS.map((product) => (
							<div
								key={product.id}
								className="flex items-center justify-between gap-4 px-6 py-4"
							>
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 shrink-0 rounded-lg bg-surface border border-border" />
									<div>
										<p className="text-sm font-semibold text-primary">
											{product.name}
										</p>
										<p className="text-xs text-muted">{product.category}</p>
									</div>
								</div>
								<div className="hidden sm:flex items-center gap-8 text-sm">
									<div className="text-right">
										<p className="text-xs text-muted">Fiyat</p>
										<p className="font-semibold text-primary">
											{product.price}
										</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-muted">Stok</p>
										<p
											className={`font-semibold ${product.stock === 0 ? "text-red-500" : "text-primary"}`}
										>
											{product.stock}
										</p>
									</div>
									<span
										className={`rounded-full px-3 py-1 text-xs font-medium ${
											product.status === "Aktif"
												? "bg-green-50 text-green-600"
												: "bg-surface text-muted"
										}`}
									>
										{product.status}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-accent hover:border-accent">
										<Pencil size={14} />
									</button>
									<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-red-500 hover:border-red-200">
										<Trash2 size={14} />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Orders Tab */}
			{activeTab === "orders" && (
				<div className="rounded-xl border border-border bg-background">
					<div className="flex items-center justify-between border-b border-border px-6 py-4">
						<h2 className="font-semibold text-primary">Siparişler</h2>
					</div>
					<div className="divide-y divide-border">
						{PLACEHOLDER_ORDERS.map((order) => (
							<div
								key={order.id}
								className="flex items-center justify-between gap-4 px-6 py-4"
							>
								<div>
									<p className="text-sm font-semibold text-primary">
										{order.id} — {order.product}
									</p>
									<p className="text-xs text-muted mt-0.5">
										{order.customer} · {order.date}
									</p>
								</div>
								<div className="flex items-center gap-4">
									<p className="hidden sm:block text-sm font-semibold text-primary">
										{order.total}
									</p>
									<span
										className={`rounded-full px-3 py-1 text-xs font-medium ${
											order.status === "Tamamlandı"
												? "bg-green-50 text-green-600"
												: "bg-yellow-50 text-yellow-600"
										}`}
									>
										{order.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
