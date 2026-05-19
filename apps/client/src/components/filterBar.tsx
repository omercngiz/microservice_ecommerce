interface FilterBarProps {
	children: React.ReactNode;
}

const FilterBar = ({ children }: FilterBarProps) => {
	return (
		<div className="flex flex-wrap justify-between p-2 gap-3 rounded-lg">
			{children}
		</div>
	);
};

export default FilterBar;
