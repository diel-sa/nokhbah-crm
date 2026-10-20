"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { CardTableEmpty } from "@crm/ui/components/card-table";
import {
	SimpleTable,
	type SimpleTableColumn,
	SimpleTableRow,
} from "@crm/ui/components/simple-table";
import { TableCell } from "@crm/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { t, useLocale } from "@/components/locale-provider";
import { useTRPC } from "@/lib/trpc/client";

const CELL = "px-3 py-2.5 align-middle";

export function TrafficSources() {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const sources = useQuery(trpc.tracking.sources.queryOptions());

	if (!sources.data) return null;

	const columns: SimpleTableColumn[] = [
		{
			id: "source",
			header: t(messages, "settings.tracking.sources.colSource"),
		},
		{
			id: "medium",
			header: t(messages, "settings.tracking.sources.colMedium"),
			width: "w-32",
		},
		{
			id: "views",
			header: t(messages, "settings.tracking.sources.colViews"),
			width: "w-28",
			align: "right",
		},
		{
			id: "contacts",
			header: t(messages, "settings.tracking.sources.colContacts"),
			width: "w-24",
			align: "right",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t(messages, "settings.tracking.sources.title")}</CardTitle>
				<CardDescription>
					{t(messages, "settings.tracking.sources.description")}
				</CardDescription>
			</CardHeader>

			{sources.data.length === 0 ? (
				<CardTableEmpty>
					{t(messages, "settings.tracking.sources.empty")}
				</CardTableEmpty>
			) : (
				<SimpleTable columns={columns}>
					{sources.data.map((row) => (
						<SimpleTableRow key={`${row.source}-${row.medium ?? ""}`}>
							<TableCell className={CELL}>{row.source}</TableCell>
							<TableCell className={`${CELL} text-muted-foreground`}>
								{row.medium ?? "—"}
							</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>
								{row.views.toLocaleString()}
							</TableCell>
							<TableCell className={`${CELL} text-right tabular-nums`}>
								{row.contacts.toLocaleString()}
							</TableCell>
						</SimpleTableRow>
					))}
				</SimpleTable>
			)}
		</Card>
	);
}
