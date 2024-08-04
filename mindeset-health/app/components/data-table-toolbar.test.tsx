import { Table } from "@tanstack/react-table";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableToolbar } from "./data-table-toolbar";
// Mock implementations for UI components
jest.mock("@/components/ui/button", () => ({
	Button: (props: any) => <button {...props}>{props.children}</button>,
}));

jest.mock("@/components/ui/input", () => ({
	Input: (props: any) => <input {...props} />,
}));

jest.mock("./data-table-faceted-filter", () => ({
	DataTableFacetedFilter: (props: any) => <div {...props} />,
}));

jest.mock("./data-table-view-options", () => ({
	DataTableViewOptions: (props: any) => (
		<div {...props}>DataTableViewOptions</div>
	),
}));

// Create a mock implementation of useReactTable
const createMockTable = () =>
	({
		getState: jest.fn().mockReturnValue({
			columnFilters: [],
			pagination: { pageSize: 10, pageIndex: 0 },
		}),
		getColumn: jest.fn().mockImplementation(
			(columnId: string) =>
				({
					getFilterValue: jest.fn().mockReturnValue(""),
					setFilterValue: jest.fn(),
				} as any)
		),
		resetColumnFilters: jest.fn(),
		setPageSize: jest.fn(),
		setPageIndex: jest.fn(),
		previousPage: jest.fn(),
		nextPage: jest.fn(),
		getPageCount: jest.fn().mockReturnValue(1),
		getPageIndex: jest.fn().mockReturnValue(0),
		getCanPreviousPage: jest.fn().mockReturnValue(false),
		getCanNextPage: jest.fn().mockReturnValue(false),
		getFacetedUniqueValues: jest.fn().mockReturnValue(new Map()),
		getCoreRowModel: jest.fn(),
		getFilteredRowModel: jest.fn(),
		getPaginationRowModel: jest.fn(),
		getSortedRowModel: jest.fn(),
		getFacetedRowModel: jest.fn(),
	} as unknown as Table<any>);

describe("DataTableToolbar", () => {
	let mockTable: Table<any>;

	beforeEach(() => {
		mockTable = createMockTable();
	});

	test("renders filter inputs and faceted filter if column is present", () => {
		(mockTable.getColumn as jest.Mock).mockImplementation(
			(columnId: string) => {
				if (columnId === "category") {
					return {
						getFilterValue: jest.fn().mockReturnValue(""),
						setFilterValue: jest.fn(),
					} as any;
				}
				return {
					getFilterValue: jest.fn().mockReturnValue(""),
					setFilterValue: jest.fn(),
				} as any;
			}
		);

		render(<DataTableToolbar table={mockTable} />);

		expect(
			screen.getByPlaceholderText("Filter prizes by year...")
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(
				"Filter prizes by laureates first name..."
			)
		).toBeInTheDocument();

		// Check if DataTableFacetedFilter is rendered
		expect(screen.queryByText("Category")).not.toBeInTheDocument();

		// Check if Reset button is not present when no filters are applied
		expect(screen.queryByText("Reset")).not.toBeInTheDocument();
	});

	test("calls resetColumnFilters when Reset button is clicked", () => {
		(mockTable.getState as jest.Mock).mockReturnValue({
			columnFilters: ["year", "laureates"],
		}); // Simulate active filters
		render(<DataTableToolbar table={mockTable} />);

		expect(screen.getByText("Reset")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Reset"));
		expect(mockTable.resetColumnFilters).toHaveBeenCalled();
	});

	test("renders DataTableViewOptions component", () => {
		render(<DataTableToolbar table={mockTable} />);
		expect(screen.getByText("DataTableViewOptions")).toBeInTheDocument();
	});

	test("does not render DataTableFacetedFilter if column is not present", () => {
		(mockTable.getColumn as jest.Mock).mockImplementation(
			(columnId: string) => {
				if (columnId === "category") {
					return undefined;
				}
				return {
					getFilterValue: jest.fn().mockReturnValue(""),
					setFilterValue: jest.fn(),
				} as any;
			}
		);

		render(<DataTableToolbar table={mockTable} />);
		expect(screen.queryByText("Category")).not.toBeInTheDocument();
	});
});
