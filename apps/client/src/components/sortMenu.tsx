"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";

const sortOptions = [
	{ label: "En Yeni", value: "newest" },
	{ label: "En Eski", value: "oldest" },
	{ label: "En Pahalı", value: "asc" },
	{ label: "En Ucuz", value: "desc" },
] as const;

interface SortMenuProps {
	queryKey?: string;
	className?: string;
}

export function SortMenu({ queryKey = "sort", className }: SortMenuProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const current = searchParams.get(queryKey);

	const handleSelect = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (current === value) {
			params.delete(queryKey);
		} else {
			params.set(queryKey, value);
		}

		const query = params.toString();
		router.push(query ? `${pathname}?${query}` : pathname);
		setOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={menuRef} className={`relative ${className}`}>
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-primary transition-colors hover:border-accent hover:text-accent"
			>
				<ArrowUpDown className="size-4 text-accent" />
				{sortOptions.find((o) => o.value === current)?.label ?? "Sırala"}
			</button>

			{open && (
				<div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-border bg-background py-1 shadow-lg">
					{sortOptions.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => handleSelect(option.value)}
							className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface ${
								current === option.value
									? "font-medium text-accent"
									: "text-primary"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default SortMenu;
