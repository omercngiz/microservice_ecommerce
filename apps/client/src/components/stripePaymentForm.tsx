"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { tokenStore } from "@/lib/token-store";

interface StripePaymentFormProps {
	onBack: () => void;
}

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const StripePaymentForm = ({ onBack }: StripePaymentFormProps) => {
	const { items } = useCart();
	const { isLoading, isAuthenticated } = useAuth();

	const fetchClientSecret = React.useCallback(async () => {
		const token = tokenStore.get();
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/payment/stripe/session/create-checkout-session`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cart: items.map((item) => ({
						id: item.product.id,
						name: item.product.name,
						quantity: item.quantity,
					})),
				}),
			},
		);

		if (!res.ok) {
			const errBody = await res
				.json()
				.catch(() => ({ error: `HTTP ${res.status}` }));
			throw new Error(errBody.error ?? `HTTP ${res.status}`);
		}

		const data = (await res.json()) as { clientSecret: string };
		return data.clientSecret;
	}, [items]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!isAuthenticated) {
		return <p>Lütfen giriş yapın.</p>;
	}

	const options = {
		fetchClientSecret,
	};

	return (
		<div id="checkout">
			<EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
			<Button type="button" variant="ghost" onClick={onBack}>
				Geri Dön
			</Button>
		</div>
	);
};

export default StripePaymentForm;
