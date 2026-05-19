"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
	queryKey?: string;
	placeholder?: string;
	className?: string;
}

export function SearchBar({
	queryKey = "search",
	placeholder = "Ara...",
	className,
}: SearchBarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const [value, setValue] = useState(searchParams.get(queryKey) ?? "");

	const applySearch = (search: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (search.trim()) {
			params.set(queryKey, search.trim());
		} else {
			params.delete(queryKey);
		}

		const query = params.toString();
		router.push(query ? `${pathname}?${query}` : pathname);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applySearch(value);
		}
	};

	const handleClear = () => {
		setValue("");
		applySearch("");
	};

	return (
		<div
			className={`relative max-w-lg w-full rounded-full border border-border bg-background px-4 text-sm text-primary transition-colors hover:border-accent hover:text-accent ${className}`}
		>
			<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" />
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="w-full rounded-full bg-background py-2 pl-10 pr-9 text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
			/>
			{value && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-primary"
				>
					<X className="size-4" />
				</button>
			)}
		</div>
	);
}

export default SearchBar;
