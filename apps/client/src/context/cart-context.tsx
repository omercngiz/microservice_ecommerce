"use client";

import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	type ReactNode,
} from "react";
export interface CartProduct {
	id: string;
	name: string;
	price: number;
	images: string[];
	slug: string;
}

export interface CartItem {
	product: CartProduct;
	quantity: number;
}

interface CartState {
	items: CartItem[];
}

type CartAction =
	| { type: "ADD_ITEM"; product: CartProduct }
	| { type: "REMOVE_ITEM"; productId: string }
	| { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
	| { type: "CLEAR_CART" }
	| { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_ITEM": {
			const existing = state.items.find(
				(item) => item.product.id === action.product.id,
			);
			if (existing) {
				return {
					items: state.items.map((item) =>
						item.product.id === action.product.id
							? { ...item, quantity: item.quantity + 1 }
							: item,
					),
				};
			}
			return {
				items: [...state.items, { product: action.product, quantity: 1 }],
			};
		}
		case "REMOVE_ITEM":
			return {
				items: state.items.filter(
					(item) => item.product.id !== action.productId,
				),
			};
		case "UPDATE_QUANTITY": {
			if (action.quantity <= 0) {
				return {
					items: state.items.filter(
						(item) => item.product.id !== action.productId,
					),
				};
			}
			return {
				items: state.items.map((item) =>
					item.product.id === action.productId
						? { ...item, quantity: action.quantity }
						: item,
				),
			};
		}
		case "CLEAR_CART":
			return { items: [] };
		case "HYDRATE":
			return { items: action.items };
		default:
			return state;
	}
}

interface CartContextValue {
	items: CartItem[];
	addItem: (product: CartProduct) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cengizdev-cart";

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, { items: [] });

	// Hydrate from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as CartItem[];
				if (Array.isArray(parsed)) {
					dispatch({ type: "HYDRATE", items: parsed });
				}
			}
		} catch {
			// Ignore parse errors
		}
	}, []);

	// Persist to localStorage on change
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
		} catch {
			// Ignore storage errors
		}
	}, [state.items]);

	const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

	const totalPrice = state.items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	);

	const value: CartContextValue = {
		items: state.items,
		addItem: (product: CartProduct) => dispatch({ type: "ADD_ITEM", product }),
		removeItem: (productId: string) =>
			dispatch({ type: "REMOVE_ITEM", productId }),
		updateQuantity: (productId: string, quantity: number) =>
			dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
		clearCart: () => dispatch({ type: "CLEAR_CART" }),
		totalItems,
		totalPrice,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
