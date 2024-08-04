"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { categories } from "../type";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex-row md:flex flex-1 items-center space-y-2 md:space-y-0 md:space-x-2">
				<Input
					placeholder="Filter prizes by year..."
					value={
						(table.getColumn("year")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("year")
							?.setFilterValue(event.target.value)
					}
					className="h-8 w-[250px] lg:w-[250px]"
				/>

				<Input
					placeholder="Filter prizes by laureates first name..."
					value={
						(table
							.getColumn("laureates")
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn("laureates")
							?.setFilterValue(event.target.value)
					}
					className="h-8 w-[350px] lg:w-[350px]"
				/>

				{table.getColumn("category") && (
					<DataTableFacetedFilter
						column={table.getColumn("category")}
						title="Category"
						options={categories}
					/>
				)}

				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 lg:px-3">
						Reset
						<X className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
