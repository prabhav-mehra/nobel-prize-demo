import { Table } from "@tanstack/react-table";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableViewOptions } from "./data-table-view-options";

// Mock implementations for UI components

jest.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
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

const createMockTable = () => ({
  getAllColumns: jest.fn().mockReturnValue([
    { id: "column1", accessorFn: () => {}, getCanHide: () => true, getIsVisible: () => true, toggleVisibility: jest.fn() },
    { id: "column2", accessorFn: () => {}, getCanHide: () => true, getIsVisible: () => false, toggleVisibility: jest.fn() },
  ]),
} as unknown as Table<any>);

describe("DataTableViewOptions", () => {
  let mockTable: Table<any>;

  beforeEach(() => {
    mockTable = createMockTable();
  });

  test("renders dropdown menu with correct items", () => {
    render(<DataTableViewOptions table={mockTable} />);

    // Check that the dropdown trigger button is present
    expect(screen.getByRole("button", { name: /View/i })).toBeInTheDocument();

    // Open the dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    // Check that the dropdown menu content is present
    expect(screen.getByText("Toggle columns")).toBeInTheDocument();

    // Check dropdown menu items
    expect(screen.getByText("column1")).toBeInTheDocument();
    expect(screen.getByText("column2")).toBeInTheDocument();
  });

  test("calls toggleVisibility with correct arguments on checkbox change", () => {
    render(<DataTableViewOptions table={mockTable} />);

    // Open the dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /View/i }));

    // Check the initial state of checkboxes
    const column1Checkbox = screen.getByLabelText("column1");
    const column2Checkbox = screen.getByLabelText("column2");

    // Simulate checking and unchecking
    fireEvent.click(column1Checkbox);
    fireEvent.click(column2Checkbox);

    // Check that toggleVisibility was called with the correct arguments
    expect(mockTable.getAllColumns()[0].toggleVisibility).toHaveBeenCalledWith(false);
    expect(mockTable.getAllColumns()[1].toggleVisibility).toHaveBeenCalledWith(true);
  });
});