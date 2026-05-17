import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { trTR } from "@clerk/localizations";

const playfairDisplay = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});

export const metadata: Metadata = {
	title: "cengizdev",
	description: "cengizdev — Web Uygulaması",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			localization={trTR}
			appearance={{
				theme: "simple",
				variables: {
					colorPrimary: "#3b82f6",
					fontFamily: "var(--font-playfair)",
				},
			}}
		>
			<html lang="tr" className={playfairDisplay.variable}>
				<body className="flex min-h-dvh flex-col font-(family-name:--font-playfair) text-primary antialiased">
					<CartProvider>
						<Navbar />
						<main className="flex-1">{children}</main>
						<Footer />
					</CartProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
