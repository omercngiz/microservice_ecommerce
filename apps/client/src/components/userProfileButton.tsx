"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Store, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const UserProfileButton = () => {
	const { user, logout } = useAuth();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Dropdown dışına tıklanınca kapat
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const navigate = (path: string) => {
		setOpen(false);
		router.push(path);
	};

	const handleLogout = async () => {
		setOpen(false);
		await logout();
		router.push("/");
	};

	const initials = user?.email?.slice(0, 2).toUpperCase() ?? "?";

	return (
		<div className="relative" ref={ref}>
			{/* Trigger button */}
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white text-sm font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
				aria-label="Kullanıcı menüsü"
				aria-expanded={open}
			>
				{initials}
			</button>

			{/* Dropdown */}
			{open && (
				<div className="absolute right-0 top-11 z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
					{/* User info header */}
					<div className="flex items-center gap-3 border-b border-border px-4 py-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
							<User size={16} />
						</div>
						<div className="flex flex-col overflow-hidden">
							<span className="truncate text-xs font-medium text-primary">
								{user?.email}
							</span>
							<span className="text-[10px] capitalize text-muted">
								{user?.role}
							</span>
						</div>
					</div>

					{/* Menu items */}
					<div className="py-1">
						<MenuItem
							icon={<Settings size={15} />}
							label="Hesabı Yönet"
							onClick={() => navigate("/profile")}
						/>
						<MenuItem
							icon={<ShoppingBag size={15} />}
							label="Siparişler"
							onClick={() => navigate("/orders")}
						/>
						<MenuItem
							icon={<Store size={15} />}
							label="Satıcı Paneli"
							onClick={() => navigate("/seller")}
						/>
					</div>

					{/* Logout */}
					<div className="border-t border-border py-1">
						<MenuItem
							icon={<LogOut size={15} />}
							label="Çıkış Yap"
							onClick={handleLogout}
							danger
						/>
					</div>
				</div>
			)}
		</div>
	);
};

function MenuItem({
	icon,
	label,
	onClick,
	danger = false,
}: {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	danger?: boolean;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-muted/40 ${
				danger ? "text-destructive" : "text-primary"
			}`}
		>
			{icon}
			{label}
		</button>
	);
}

export default UserProfileButton;
