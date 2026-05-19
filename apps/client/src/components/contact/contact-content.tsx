"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/contact/social-links";
import PageBanner from "../pageBanner";

export function ContactContent() {
	return (
		<>
			{/* Hero Banner — same style as home & about */}
			<PageBanner
				title="İletişim"
				description="Sorularınız ve fikirlerinizi bizimle paylaşın."
			/>

			{/* Contact + Map */}
			<section className="border-t border-border">
				<div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
					<div className="grid gap-10 lg:grid-cols-2">
						{/* Left: Form + Info (on top for mobile) */}
						<div className="order-1">
							<h2 className="text-2xl font-bold text-primary">Bize Yazın</h2>
							<p className="mt-1 text-sm text-muted">
								Formu doldurun, en kısa sürede size dönüş yapalım.
							</p>

							<div className="mt-6">
								<ContactForm />
							</div>

							{/* Contact Info */}
							<div className="mt-10 space-y-4 border-t border-border pt-8">
								<h3 className="text-xs font-bold uppercase tracking-wider text-primary">
									İletişim Bilgileri
								</h3>

								<div className="flex items-center gap-3 text-sm text-muted">
									<Mail size={16} className="shrink-0 text-accent" />
									<a
										href="mailto:irtibat@cengizdev.com"
										className="transition-colors hover:text-primary"
									>
										irtibat@cengizdev.com
									</a>
								</div>

								<div className="flex items-center gap-3 text-sm text-muted">
									<Phone size={16} className="shrink-0 text-accent" />
									<a
										href="tel:+908502244424"
										className="transition-colors hover:text-primary"
									>
										0850 224 44 24
									</a>
								</div>

								<div className="flex items-center gap-3 text-sm text-muted">
									<MapPin size={16} className="shrink-0 text-accent" />
									<span>İstanbul, Türkiye</span>
								</div>

								<SocialLinks />
							</div>
						</div>

						{/* Right: Google Maps (bottom for mobile) */}
						<div className="order-2 overflow-hidden rounded-xl border border-border">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6504757828565!2d29.0225!3d40.9925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac790b17ba89d%3A0x4b4542e2cab5e893!2sCengiz%20Bilgi%20Teknolojileri!5e0!3m2!1str!2str!4v1711461600000!5m2!1str!2str"
								className="h-80 w-full lg:h-full lg:min-h-125"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Cengiz Bilgi Teknolojileri Konum"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* WhatsApp Floating Button */}
			<a
				href="https://wa.me/908502244424"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="WhatsApp ile iletişime geç"
				className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
					<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
				</svg>
			</a>
		</>
	);
}
