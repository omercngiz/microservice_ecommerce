import FilterBar from "@/components/filterBar";
import { FilterItem } from "@/components/filterItem";
import GaleryItem from "@/components/galeryItem";
import { ItemPanel } from "@/components/itemPanel";
import SearchBar from "@/components/searchBar";
import SortMenu from "@/components/sortMenu";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

interface Category {
	name: string;
	slug: string;
}

interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	images: string[];
}

async function getCategories(): Promise<Category[]> {
	try {
		const res = await fetch(`${API_GATEWAY_URL}/product/categories`, {
			next: { revalidate: 0 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

async function getProducts(params: {
	sort?: string;
	category?: string;
	search?: string;
}): Promise<Product[]> {
	try {
		const query = new URLSearchParams();
		if (params.sort) query.set("sort", params.sort);
		if (params.category) query.set("category", params.category);
		if (params.search) query.set("search", params.search);

		const url = `${API_GATEWAY_URL}/product/products${query.toString() ? `?${query}` : ""}`;
		const res = await fetch(url, { next: { revalidate: 0 } });
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ sort?: string; category?: string; search?: string }>;
}) {
	const params = await searchParams;
	const [categories, products] = await Promise.all([
		getCategories(),
		getProducts(params),
	]);

	return (
		<>
			<section className="flex flex-1 flex-col items-center justify-center px-4 py-4 text-center sm:py-6 md:px-12">
				<FilterBar>
					<div className="flex flex-row w-full">
						<SearchBar className="mr-2" placeholder="Ürünlerde ara..." />
						<SortMenu className="ml-auto" />
					</div>
					{categories.map((category) => (
						<FilterItem
							key={category.slug}
							name={category.name}
							slug={category.slug}
							queryKey="category"
						/>
					))}
				</FilterBar>

				<ItemPanel className="mt-6">
					{products
						.filter((p) => p.images.length > 0)
						.map((product) => (
							<GaleryItem key={product.id} product={product} />
						))}
				</ItemPanel>
			</section>
		</>
	);
}
