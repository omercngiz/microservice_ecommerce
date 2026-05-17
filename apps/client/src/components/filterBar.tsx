interface FilterBarProps {
	children: React.ReactNode;
}

const FilterBar = ({ children }: FilterBarProps) => {
	return (
		<div className="flex flex-wrap m-2 gap-3 rounded-lg bg-blue-300 py-1 px-1">
			{children}
		</div>
	);
};

export default FilterBar;
