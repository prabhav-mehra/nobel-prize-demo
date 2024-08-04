import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

// Mock the UI components
jest.mock("@/components/ui/button", () => ({
	Button: (props: any) => <button {...props}>{props.children}</button>,
}));

jest.mock("@/components/ui/input", () => ({
	Input: (props: any) => <input {...props} />,
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
	DropdownMenu: (props: any) => <div {...props} />,
	DropdownMenuTrigger: (props: any) => <div {...props} />,
	DropdownMenuContent: (props: any) => <div {...props} />,
	DropdownMenuLabel: (props: any) => <div {...props} />,
	DropdownMenuSeparator: (props: any) => <div {...props} />,
	DropdownMenuCheckboxItem: (props: any) => (
		<div>
			<input
				type="checkbox"
				checked={props.checked}
				onChange={(e) => props.onCheckedChange(e.target.checked)}
				aria-label={props.children}
			/>
			{props.children}
		</div>
	),
}));

// Mock data and columns
const columns = [
	{ id: "year", header: "Year", cell: (info: any) => info.getValue() },
	{
		id: "laureates",
		header: "Laureates",
		cell: (info: any) => info.getValue(),
	},
];

const data = [
	{ year: "2023", laureates: "Jane Doe" },
	{ year: "2022", laureates: "John Smith" },
];

const createMockTable = () => ({
	getHeaderGroups: jest.fn().mockReturnValue([
		{
			id: "header-group-1",
			headers: columns.map((col) => ({
				id: col.id,
				column: {
					columnDef: col,
					getContext: () => ({}),
				},
				colSpan: 1,
				isPlaceholder: false,
			})),
		},
	]),
	getRowModel: jest.fn().mockReturnValue({
		rows: data.map((row, index) => ({
			id: `row-${index}`,
			getIsSelected: jest.fn().mockReturnValue(false),
			getVisibleCells: () =>
				columns.map((col) => ({
					id: col.id,
					column: {
						columnDef: col,
						getContext: () => ({}),
					},
					getValue: () => row[col.id as keyof typeof row],
				})),
		})),
	}),
	getPageCount: jest.fn().mockReturnValue(1),
	getCanPreviousPage: jest.fn().mockReturnValue(false),
	getCanNextPage: jest.fn().mockReturnValue(false),
	previousPage: jest.fn(),
	nextPage: jest.fn(),
	setPageIndex: jest.fn(),
	setPageSize: jest.fn(),
	getState: jest.fn().mockReturnValue({
		sorting: [],
		columnVisibility: {},
		columnFilters: [],
	}),
	getAllColumns: jest.fn().mockReturnValue(columns),
});

describe("DataTable", () => {
	test("renders table with data and header", () => {
		render(<DataTable columns={columns} data={data} />);

		expect(screen.getByText("Year")).toBeInTheDocument();
		expect(screen.getByText("Laureates")).toBeInTheDocument();
	});

	test("renders empty state when no data is provided", () => {
		render(<DataTable columns={columns} data={[]} />);

		expect(screen.getByText("No results.")).toBeInTheDocument();
	});

	test("renders DataTableToolbar and DataTablePagination components", () => {
		render(<DataTable columns={columns} data={data} />);

		// Simulate interaction with toolbar
		fireEvent.change(
			screen.getByPlaceholderText("Filter prizes by year..."),
			{
				target: { value: "2023" },
			}
		);
		expect(
			screen.getByPlaceholderText("Filter prizes by year...")
		).toHaveValue("2023");
	});
});
