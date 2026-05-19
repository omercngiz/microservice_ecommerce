"use client";

import { Fragment, useState } from "react";
import { Check } from "lucide-react";
import PageBanner from "@/components/pageBanner";
import CartReview from "@/components/cart/CartReview";
import ShippingForm from "@/components/cart/ShippingForm";
import StripePaymentForm from "@/components/stripePaymentForm";

const STEPS = [
	{ label: "Sepet" },
	{ label: "Adres" },
	{ label: "Ödeme" },
] as const;

export default function CartPage() {
	const [currentStep, setCurrentStep] = useState(0);

	const bannerDescriptions = [
		"Sepetinizdeki ürünleri kontrol edin.",
		"Teslimat adresinizi girin.",
		"Ödeme bilgilerinizi girin ve siparişi tamamlayın.",
	];

	return (
		<>
			{/* Hero Banner */}
			<PageBanner
				title="Sipariş"
				description={bannerDescriptions[currentStep]!}
			/>

			{/* Stepper */}
			<section className="border-t border-border bg-surface">
				<div className="mx-auto max-w-3xl px-4 pt-10">
					<div className="flex items-start">
						{STEPS.map((step, index) => {
							const isCompleted = index < currentStep;
							const isActive = index === currentStep;

							return (
								<Fragment key={step.label}>
									{/* Circle + label */}
									<div className="flex flex-col items-center gap-1.5">
										<div
											className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
												isCompleted
													? "bg-accent text-white"
													: isActive
														? "border-2 border-accent bg-background text-accent"
														: "border-2 border-border bg-background text-muted"
											}`}
										>
											{isCompleted ? <Check size={16} /> : index + 1}
										</div>
										<span
											className={`text-xs font-medium ${
												isActive
													? "text-accent"
													: isCompleted
														? "text-primary"
														: "text-muted"
											}`}
										>
											{step.label}
										</span>
									</div>

									{/* Connector line */}
									{index < STEPS.length - 1 && (
										<div
											className={`mt-[18px] mx-3 h-0.5 flex-1 rounded-full transition-colors ${
												isCompleted ? "bg-accent" : "bg-border"
											}`}
										/>
									)}
								</Fragment>
							);
						})}
					</div>
				</div>

				{/* Step Content */}
				<div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
					{currentStep === 0 && <CartReview onNext={() => setCurrentStep(1)} />}
					{currentStep === 1 && (
						<ShippingForm
							onNext={() => setCurrentStep(2)}
							onBack={() => setCurrentStep(0)}
						/>
					)}
					{currentStep === 2 && (
						<StripePaymentForm onBack={() => setCurrentStep(1)} />
					)}
				</div>
			</section>
		</>
	);
}
