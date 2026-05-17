"use client";

import { MoveDownIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
	{
		heading: "Cihanşümûl bir Hitap",
		subheading: "Bütün mevcudata rahmet olarak indirilip,",
	},
	{
		heading: "Cihanpesendane bir Davet",
		subheading: "Her asırda insanlığın mühim bir kısmını nurlandıran,",
	},
	{
		heading: "Emsalsiz bir Hürmet",
		subheading:
			"Her şeyin fevkinde bir hürmet ve aşkla başlar üstünde tutulan,",
	},
	{
		heading: "Bir Kitab-ı Muciznüma",
		subheading:
			"Hem bir kitab-ı zikir, hem bir kitab-ı dua, hem bir kitab-ı davet olan Kur'an-ı Kerim.",
	},
	// {
	// 	heading: "O Yola Yolcu Olmak",
	// 	subheading:
	// 		"Onu anlayabilmek, yaşayabilmek ve o yolda olanlara yoldaş olabilmek...",
	// },
	{
		heading: "Aşk Olmadan Meşk Olmaz",
		subheading:
			"O ilahi kelama duyulan aşk, bizim de kalemimize bir ateş verdi; meyvesi ise meşk oldu. ",
	},
];

const ANIM_MS = 500;

type HeroState = "visible" | "exiting" | "entering" | "hidden";

export default function VideoHero() {
	const [step, setStep] = useState(0);
	const [heroState, setHeroState] = useState<HeroState>("visible");
	const panelRef = useRef<HTMLDivElement>(null);
	const isAnimating = useRef(false);
	const touchStartY = useRef(0);

	// Slide the panel off-screen upward → reveal site content
	const exitPanel = useCallback(() => {
		const panel = panelRef.current;
		if (!panel) return;
		setHeroState("exiting");
		panel.style.transition = `transform ${ANIM_MS}ms ease-in-out`;
		panel.style.transform = "translateY(-100%)";
		setTimeout(() => {
			setHeroState("hidden");
			isAnimating.current = false;
		}, ANIM_MS);
	}, []);

	// Slide the panel back in from the top (panel is already at translateY(-100%))
	const enterPanel = useCallback(() => {
		const panel = panelRef.current;
		if (!panel) return;
		setStep(slides.length - 1);
		setHeroState("entering");
		panel.style.transition = `transform ${ANIM_MS}ms ease-in-out`;
		panel.style.transform = "translateY(0)";
		setTimeout(() => {
			setHeroState("visible");
			isAnimating.current = false;
		}, ANIM_MS);
	}, []);

	const handleDown = useCallback(() => {
		if (isAnimating.current) return;
		isAnimating.current = true;
		if (step < slides.length - 1) {
			setStep((prev) => prev + 1);
			setTimeout(() => {
				isAnimating.current = false;
			}, ANIM_MS);
		} else {
			exitPanel();
		}
	}, [step, exitPanel]);

	const handleUp = useCallback(() => {
		if (isAnimating.current || step === 0) return;
		isAnimating.current = true;
		setStep((prev) => prev - 1);
		setTimeout(() => {
			isAnimating.current = false;
		}, ANIM_MS);
	}, [step]);

	const handleReEntry = useCallback(() => {
		if (isAnimating.current) return;
		isAnimating.current = true;
		enterPanel();
	}, [enterPanel]);

	// Intercept wheel & touch while hero is active
	useEffect(() => {
		if (heroState === "hidden") return;

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			if (heroState !== "visible") return;
			if (e.deltaY > 0) handleDown();
			else handleUp();
		};
		const onTouchStart = (e: TouchEvent) => {
			touchStartY.current = e.touches[0]?.clientY ?? 0;
		};
		const onTouchEnd = (e: TouchEvent) => {
			if (heroState !== "visible") return;
			const delta = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0);
			if (Math.abs(delta) < 30) return;
			if (delta > 0) handleDown();
			else handleUp();
		};

		window.addEventListener("wheel", onWheel, { passive: false });
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: true });
		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchend", onTouchEnd);
		};
	}, [heroState, handleDown, handleUp]);

	// Re-entry: user at top of page scrolls/swipes up
	useEffect(() => {
		if (heroState !== "hidden") return;

		const onWheel = (e: WheelEvent) => {
			if (window.scrollY === 0 && e.deltaY < 0) {
				e.preventDefault();
				handleReEntry();
			}
		};
		const onTouchStart = (e: TouchEvent) => {
			touchStartY.current = e.touches[0]?.clientY ?? 0;
		};
		const onTouchEnd = (e: TouchEvent) => {
			if (window.scrollY !== 0) return;
			const delta = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0);
			if (delta < -30) handleReEntry(); // swipe down = intending to go up
		};

		window.addEventListener("wheel", onWheel, { passive: false });
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: true });
		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchend", onTouchEnd);
		};
	}, [heroState, handleReEntry]);

	return (
		<div
			ref={panelRef}
			style={{
				transform: "translateY(0)",
				// When hidden (off-screen), pass all pointer & touch events through
				pointerEvents: heroState === "hidden" ? "none" : "auto",
				touchAction: heroState === "hidden" ? "auto" : "none",
			}}
			className="fixed inset-0 z-40 overflow-hidden bg-black"
		>
			{/* Video background */}
			<video
				autoPlay
				muted
				loop
				playsInline
				preload="auto"
				poster="/opening-poster.jpg"
				className="absolute inset-0 h-full w-full object-cover object-center"
			>
				<source src="/opening-video-optimized.mp4" type="video/mp4" />
			</video>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/40" />

			{/* Text slides */}
			{slides.map((slide, i) => {
				const isCurrent = i === step;
				const isPast = i < step;
				return (
					<div
						key={i}
						className="absolute inset-0 flex flex-col items-end justify-end text-center text-white transition-all duration-500 ease-in-out"
						style={{
							opacity: isCurrent ? 1 : 0,
							transform: isPast
								? "translateY(-40px)"
								: isCurrent
									? "translateY(0)"
									: "translateY(40px)",
							pointerEvents: isCurrent ? "auto" : "none",
						}}
					>
						<div className="w-full px-6 pt-12 [background:linear-gradient(to_top,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_100%)]">
							<div className="flex flex-row">
								<div className="flex flex-col gap-2 mr-6 items-center justify-center">
									{slides.map((_, dotIndex) => (
										<div
											key={dotIndex}
											className="h-2 w-2 rounded-full transition-all duration-500"
											style={{
												backgroundColor:
													dotIndex === i
														? "rgba(255,255,255,1)"
														: "rgba(255,255,255,0.3)",
												transform: dotIndex === i ? "scale(1.3)" : "scale(1)",
											}}
										/>
									))}
								</div>
								<div>
									<h1 className="text-4xl text-left opacity-75 font-bold tracking-wide md:text-6xl">
										{slide.heading}
									</h1>
									<p className="text-2xl mt-4 text-left opacity-75 md:text-xl">
										{slide.subheading}
									</p>
								</div>
							</div>
							<div className="flex justify-center">
								<MoveDownIcon className="mt-8 mb-4 animate-bounce" />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
