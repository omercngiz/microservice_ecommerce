import type { Metadata } from "next";
import { Feather, Award, BookOpen, Heart } from "lucide-react";
import PageBanner from "@/components/pageBanner";

export const metadata: Metadata = {
	title: "Hakkımızda",
	description:
		"Geleneksel Türk-İslam hat sanatını yaşatan ve özgün eserler sunan atölyemiz hakkında.",
};

const values = [
	{
		icon: <Feather size={24} />,
		title: "Özgün Eserler",
		description:
			"Her eser, kalem ve mürekkeple özene özen katılarak el ile üretilir. Seri üretim yoktur; her parça tektir.",
	},
	{
		icon: <Award size={24} />,
		title: "Geleneksel Teknikler",
		description:
			"Osmanlı'dan miras kalan sülüs, celi sülüs, divani ve ta'liq gibi köklü hat ekollerini yaşatıyoruz.",
	},
	{
		icon: <BookOpen size={24} />,
		title: "Ustadan Öğrenilmiş Sanat",
		description:
			"Yıllar süren meşk geleneğiyle ustadan alınan eğitim, her esere derin bir kültürel miras yansıtır.",
	},
	{
		icon: <Heart size={24} />,
		title: "Sanata Adanmışlık",
		description:
			"Hat sanatını bir meslek olarak değil, bir yaşam biçimi olarak benimsiyoruz. Her harfte bu sevgi hissedilir.",
	},
];

const styles = [
	{
		name: "Sülüs",
		description:
			"İslam hat sanatının temel ekolü. Dengeli ve görkemli yapısıyla her mekâna uyum sağlar.",
	},
	{
		name: "Celi Sülüs",
		description:
			"Büyük boyutlu sülüs kompozisyonlar. Camiler ve anıtsal mekânlar için tercih edilir.",
	},
	{
		name: "Divani",
		description:
			"Osmanlı divan yazışmalarından doğan, akıcı ve süslü bir hat üslubu.",
	},
	{
		name: "Ta'liq",
		description:
			"İran kökenli, zarif ve eğimli yapısıyla şiir ve edebî metinlerde sıkça kullanılır.",
	},
	{
		name: "Kufi",
		description:
			"Hat sanatının en köklü ekolü. Geometrik ve güçlü yapısıyla mimari eserlerde öne çıkar.",
	},
	{
		name: "Murakka",
		description:
			"Farklı hat ekollerini bir araya getiren albüm kompozisyonları.",
	},
];

export default function AboutPage() {
	return (
		<>
			{/* Hero Banner */}
			<PageBanner
				title="Hakkımızda"
				description="Kamışın ucundan süzülen harflerle köklü bir geleneği yaşatıyoruz."
			/>

			{/* About Content */}
			<section className="border-t border-border">
				<div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
					<h2 className="text-2xl font-bold text-primary">Kimiz?</h2>
					<div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
						<p>
							Atölyemiz, geleneksel Türk-İslam hat sanatını yaşatmak ve özgün
							eserler üretmek amacıyla kurulmuştur. Yüzyıllar öncesinden bugüne
							taşınan bu kadim sanatı, hem ustadan öğrenilen tekniklerle hem de
							günümüz estetik anlayışıyla harmanlayarak sunuyoruz.
						</p>
						<p>
							Ürettiğimiz her eser; özenle seçilmiş Türk kâğıdı veya derisi,
							geleneksel yöntemlerle hazırlanan mürekkep ve kamış kalemle,
							tamamen el ile yazılmaktadır. Hiçbir eser birbirinin kopyası
							değildir; her biri sanatçının o ana koyduğu emeği taşır.
						</p>
						<p>
							Koleksiyonumuzda ev ve ofis dekorasyonundan hediyeye, küçük
							boyutlu levhalardan büyük celi kompozisyonlara kadar geniş bir
							yelpazede eser bulabilirsiniz. Her eser kargo ile güvenli biçimde
							teslim edilir.
						</p>
					</div>
				</div>
			</section>

			{/* Hat Styles */}
			<section className="border-t border-border bg-surface">
				<div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-primary">Hat Ekolleri</h2>
						<p className="mx-auto mt-2 max-w-lg text-sm text-muted">
							Koleksiyonumuzda yer alan eserlerin yazıldığı geleneksel hat
							üslupları.
						</p>
					</div>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{styles.map((style) => (
							<div
								key={style.name}
								className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
							>
								<h3 className="text-sm font-bold text-primary">{style.name}</h3>
								<p className="mt-1.5 text-sm text-muted">{style.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="border-t border-border">
				<div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-primary">Değerlerimiz</h2>
						<p className="mx-auto mt-2 max-w-lg text-sm text-muted">
							Her eserin arkasındaki anlayış ve ilkeler.
						</p>
					</div>
					<div className="mt-10 grid gap-5 sm:grid-cols-2">
						{values.map((value) => (
							<div
								key={value.title}
								className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
									{value.icon}
								</div>
								<h3 className="mt-4 text-sm font-bold text-primary">
									{value.title}
								</h3>
								<p className="mt-1.5 text-sm text-muted">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
