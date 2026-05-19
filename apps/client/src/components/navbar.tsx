"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import UserProfileButton from "./userProfileButton";
import { Logo } from "./logo";

const navLinks = [
	{ href: "/about", label: "Hakkımızda" },
	{ href: "/store", label: "Mağaza" },
	{ href: "/contact", label: "İletişim" },
];

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { totalItems } = useCart();
	const { isAuthenticated } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
				{/* Logo */}
				<Link
					href="/"
					className="text-xl font-bold tracking-tight text-primary"
				>
					<Logo />
				</Link>

				{/* Desktop Nav */}
				<div className="hidden items-center gap-8 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-muted transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}

					{/* Cart Icon */}
					<Link
						href="/cart"
						className="relative text-muted transition-colors hover:text-primary"
						aria-label="Sepet"
					>
						<ShoppingCart size={20} />
						{totalItems > 0 && (
							<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
								{totalItems}
							</span>
						)}
					</Link>

					{isAuthenticated ? (
						<UserProfileButton />
					) : (
						<Link
							href="/auth"
							className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
						>
							Giriş Yap
						</Link>
					)}
				</div>

				{/* Mobile Toggle */}
				<div className="flex items-center gap-4 md:hidden">
					<Link
						href="/cart"
						className="relative text-muted transition-colors hover:text-primary"
						aria-label="Sepet"
					>
						<ShoppingCart size={20} />
						{totalItems > 0 && (
							<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
								{totalItems}
							</span>
						)}
					</Link>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="text-primary"
						aria-label="Menüyü aç/kapat"
					>
						{isOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</nav>

			{/* Mobile Menu */}
			<div
				className={cn(
					"overflow-hidden border-t border-border transition-all duration-300 md:hidden",
					isOpen ? "max-h-72" : "max-h-0 border-t-0",
				)}
			>
				<div className="flex flex-col gap-4 px-4 py-4">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setIsOpen(false)}
							className="text-sm font-medium text-muted transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}

					{isAuthenticated ? (
						<UserProfileButton />
					) : (
						<Link
							href="/auth"
							className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
						>
							Giriş Yap
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
