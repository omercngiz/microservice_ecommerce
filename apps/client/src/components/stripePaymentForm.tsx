"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "@/context/cart-context";

interface StripePaymentFormProps {
	onBack: () => void;
}

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const StripePaymentForm = ({ onBack }: StripePaymentFormProps) => {
	const { items } = useCart();
	const fetchClientSecret = React.useCallback(async (token: string) => {
		// Create a Checkout Session
		return fetch(
			`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/session/create-checkout-session`,
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
		)
			.then((res) => res.json())
			.then((data) => data.clientSecret);
	}, []);

	const [token, setToken] = React.useState<string | null>(null);
	const { getToken } = useAuth();

	React.useEffect(() => {
		getToken().then((token) => setToken(token));
	}, []);

	if (!token) {
		return <p>Loading...</p>;
	}

	const options = {
		fetchClientSecret: () => fetchClientSecret(token),
	};

	return (
		<div id="checkout">
			<div>
				<p>options: {JSON.stringify(options)}</p>
			</div>
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
