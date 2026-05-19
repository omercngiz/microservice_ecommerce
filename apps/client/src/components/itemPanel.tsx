interface ItemPanelProps {
	children: React.ReactNode;
	className?: string;
}

export function ItemPanel({ children, className }: ItemPanelProps) {
	return (
		<div className={`flex flex-col lg:grid gap-4 lg:grid-cols-2 ${className}`}>
			{children}
		</div>
	);
}
