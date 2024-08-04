import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

jest.mock("@/components/ui/button", () => ({
	Button: (props: any) => <button {...props} />,
}));

jest.mock("@/components/ui/popover", () => ({
	Popover: ({ children }: any) => <div>{children}</div>,
	PopoverContent: ({ children }: any) => <div>{children}</div>,
	PopoverTrigger: ({ children }: any) => <>{children}</>,
}));

jest.mock("@/components/ui/command", () => ({
	Command: ({ children }: any) => <div>{children}</div>,
	CommandInput: (props: any) => <input {...props} />,
	CommandList: ({ children }: any) => <div>{children}</div>,
	CommandEmpty: ({ children }: any) => <div>{children}</div>,
	CommandGroup: ({ children }: any) => <div>{children}</div>,
	CommandItem: ({ children, onSelect }: any) => (
		<div onClick={onSelect}>{children}</div>
	),
	CommandSeparator: () => <div>Separator</div>,
}));

const mockColumn = {
	getFacetedUniqueValues: jest.fn(),
	getFilterValue: jest.fn(),
	setFilterValue: jest.fn(),
};

const options = [
	{ label: "Option 1", value: "1" },
	{ label: "Option 2", value: "2" },
	{ label: "Option 3", value: "3" },
];

describe("DataTableFacetedFilter", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("renders with given options", () => {
		render(
			<DataTableFacetedFilter
				column={mockColumn as any}
				title="Test Filter"
				options={options}
			/>
		);

		expect(screen.getByText("Test Filter")).toBeInTheDocument();
		options.forEach((option) => {
			expect(screen.getByText(option.label)).toBeInTheDocument();
		});
	});

	test("opens popover and displays options", async () => {
		render(
			<DataTableFacetedFilter
				column={mockColumn as any}
				title="Test Filter"
				options={options}
			/>
		);

		// Open the popover
		fireEvent.click(screen.getByText("Test Filter"));

		// Wait for the popover content to be visible
		await waitFor(() => {
			expect(
				screen.getByPlaceholderText("Test Filter")
			).toBeInTheDocument();
			options.forEach((option) => {
				expect(screen.getByText(option.label)).toBeInTheDocument();
			});
		});
	});

	test("selects and unselects an option", async () => {
		mockColumn.getFilterValue.mockReturnValue([]);

		render(
			<DataTableFacetedFilter
				column={mockColumn as any}
				title="Test Filter"
				options={options}
			/>
		);

		// Open the popover
		fireEvent.click(screen.getByText("Test Filter"));

		// Select an option
		fireEvent.click(screen.getByText("Option 1"));
		expect(mockColumn.setFilterValue).toHaveBeenCalledWith(["1"]);
	});

	test("displays selected options as badges", async () => {
		mockColumn.getFilterValue.mockReturnValue(["1", "2"]);
		mockColumn.getFacetedUniqueValues.mockReturnValue(
			new Map([
				["1", 10],
				["2", 20],
			])
		);

		render(
			<DataTableFacetedFilter
				column={mockColumn as any}
				title="Test Filter"
				options={options}
			/>
		);

		// Open the popover
		fireEvent.click(screen.getByText("Test Filter"));

		// Check for badges
		expect(screen.getAllByText("Option 1")).toHaveLength(2);
		expect(screen.getAllByText("Option 2")).toHaveLength(2);
		expect(screen.getByText("10")).toBeInTheDocument();
		expect(screen.getByText("20")).toBeInTheDocument();
	});

	test("clears filters on clear button click", async () => {
		mockColumn.getFilterValue.mockReturnValue(["1"]);

		render(
			<DataTableFacetedFilter
				column={mockColumn as any}
				title="Test Filter"
				options={options}
			/>
		);

		// Open the popover
		fireEvent.click(screen.getByText("Test Filter"));

		// Click the "Clear filters" button
		fireEvent.click(screen.getByText("Clear filters"));
		expect(mockColumn.setFilterValue).toHaveBeenCalledWith(undefined);
	});
});
