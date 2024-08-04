"use client";

import { ColumnDef } from "@tanstack/react-table";
import Fuse from "fuse.js";
import { Prize, categories } from "../type";
import { DataTableColumnHeader } from "./data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Prize>[] = [
	{
		accessorKey: "year",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Year" />
		),
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		cell: ({ row }) => {
			const category = categories.find(
				(priority) => priority.value === row.getValue("category")
			);

			if (!category) {
				return null;
			}

			return (
				<div className="flex items-center">
					<span>{category.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "laureates",
		header: "Laureates",
		cell: ({ row }) => {
			const laureates = row.original.laureates;
			return (
				<div>
					{laureates?.map((laureate, index) => (
						<span key={laureate.id}>
							{laureate.firstname} {laureate.surname}
							{index < laureates.length - 1 && ", "}
						</span>
					))}
				</div>
			);
		},
		filterFn: (row, id, filterValue) => {
			const laureates = row.getValue(id) as Array<{ firstname: string }>;

			if (!Array.isArray(laureates)) {
				return false;
			}

			const fuse = new Fuse(laureates, {
				keys: ["firstname"],
				includeScore: true,
				threshold: 0.1, // Lower values mean more strict matching
				distance: 100, // Maximum distance between the query and the match
			});

			const result = fuse.search(filterValue);
			return result.length > 0;
		},
	},
	{
		accessorKey: "motivation",
		header: "Motivation",
		cell: ({ row }) => {
			const laureates = row.original.laureates;
			if (laureates && laureates.length > 0 && laureates[0].motivation) {
				return laureates[0].motivation.replace(/"/g, "");
			}
			return "No motivation provided";
		},
	},
];
