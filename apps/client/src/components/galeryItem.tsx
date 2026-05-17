import Image from "next/image";

export default function GaleryItem({
	imageSrc,
	alt,
}: {
	imageSrc?: string;
	alt?: string;
}) {
	return (
		<Image
			src={imageSrc || "/besmele.png"}
			alt={alt || ""}
			className="w-full h-auto object-cover"
			width={1280}
			height={720}
		/>
	);
}
