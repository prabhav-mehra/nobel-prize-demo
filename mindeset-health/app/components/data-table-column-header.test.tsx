// DataTableColumnHeader.test.tsx
import { Column } from "@tanstack/react-table";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableColumnHeader } from "./data-table-column-header";

// Mock Button and DropdownMenu components
jest.mock("@/components/ui/button", () => ({
	Button: (props: any) => <button {...props} />,
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
	DropdownMenu: ({ children }: any) => <div>{children}</div>,
	DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
	DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
	DropdownMenuItem: ({ children, onClick }: any) => (
		<div onClick={onClick}>{children}</div>
	),
	DropdownMenuSeparator: () => <div>Separator</div>,
}));

const mockColumn: Partial<Column<any, any>> = {
	getCanSort: jest.fn(),
	getIsSorted: jest.fn(),
	toggleSorting: jest.fn(),
	toggleVisibility: jest.fn(),
};

describe("DataTableColumnHeader", () => {
	test("renders without sorting capabilities", () => {
		(mockColumn.getCanSort as jest.Mock).mockReturnValue(false);
		render(
			<DataTableColumnHeader
				column={mockColumn as Column<any, any>}
				title="Test Title"
			/>
		);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.queryByRole("button")).toBeNull();
	});

	test("renders sorting button with correct icon when sorted ascending", () => {
		(mockColumn.getCanSort as jest.Mock).mockReturnValue(true);
		(mockColumn.getIsSorted as jest.Mock).mockReturnValue("asc");
		render(
			<DataTableColumnHeader
				column={mockColumn as Column<any, any>}
				title="Test Title"
			/>
		);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(
			screen.getByRole("button").querySelector("span + svg")
		).toHaveClass("ml-2 h-4 w-4"); // ArrowUpIcon
	});

	test("renders sorting button with correct icon when sorted descending", () => {
		(mockColumn.getCanSort as jest.Mock).mockReturnValue(true);
		(mockColumn.getIsSorted as jest.Mock).mockReturnValue("desc");
		render(
			<DataTableColumnHeader
				column={mockColumn as Column<any, any>}
				title="Test Title"
			/>
		);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(
			screen.getByRole("button").querySelector("span + svg")
		).toHaveClass("ml-2 h-4 w-4"); // ArrowDownIcon
	});

	test("invokes toggleSorting with correct argument on sort menu item click", () => {
		(mockColumn.getCanSort as jest.Mock).mockReturnValue(true);
		render(
			<DataTableColumnHeader
				column={mockColumn as Column<any, any>}
				title="Test Title"
			/>
		);
		fireEvent.click(screen.getByText("Asc"));
		expect(mockColumn.toggleSorting).toHaveBeenCalledWith(false);
		fireEvent.click(screen.getByText("Desc"));
		expect(mockColumn.toggleSorting).toHaveBeenCalledWith(true);
	});

	test("invokes toggleVisibility with correct argument on hide menu item click", () => {
		(mockColumn.getCanSort as jest.Mock).mockReturnValue(true);
		render(
			<DataTableColumnHeader
				column={mockColumn as Column<any, any>}
				title="Test Title"
			/>
		);

		fireEvent.click(screen.getByText("Hide"));
		expect(mockColumn.toggleVisibility).toHaveBeenCalledWith(false);
	});
});
