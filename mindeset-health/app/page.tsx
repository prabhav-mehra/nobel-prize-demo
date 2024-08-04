"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Prize } from "./type";

const SOCKET_URL = "ws://localhost:4000";

export default function DemoPage() {
	const [prizes, setPrizes] = useState<Prize[]>([]);

	useEffect(() => {
		const socket = io(SOCKET_URL, {
			transports: ["websocket"],
		});

		socket.on("update", (data) => {
			setPrizes(data.prizes || []);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="container mx-auto py-10 space-y-5">
			<h1 className="text-center text-[24px]">Nobel Prize Winners</h1>
			<DataTable columns={columns} data={prizes} />
		</div>
	);
}
