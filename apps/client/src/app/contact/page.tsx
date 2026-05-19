import type { Metadata } from "next";
import { ContactContent } from "@/components/contact/contact-content";

export const metadata: Metadata = {
	title: "İletişim — cengizdev",
	description:
		"Bizimle iletişime geçin. Hat sanatı ve Hattatlık üzerine sorularınızı iletebilirsiniz.",
};

export default function ContactPage() {
	return <ContactContent />;
}
