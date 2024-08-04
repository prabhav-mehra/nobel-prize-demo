export interface Laureate {
	id: string;
	firstname: string;
	surname: string;
	motivation: string;
	share: string;
}

export interface Prize {
	year: string;
	category: string;
	laureates: Laureate[];
}

export interface PrizeData {
	prizes: Prize[];
}

export const categories = [
	{
		value: "chemistry",
		label: "Chemistry",
	},
	{
		value: "economics",
		label: "Economics",
	},
	{
		value: "literature",
		label: "Literature",
	},
	{
		value: "medicine",
		label: "Medicine",
	},
	{
		value: "peace",
		label: "Peace",
	},
	{
		value: "physics",
		label: "Physics",
	},
];
