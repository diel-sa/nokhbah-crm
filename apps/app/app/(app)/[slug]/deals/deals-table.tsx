"use client";

import Archive from "@carbon/icons-react/es/Archive";
import type { DealStage } from "@crm/db/enums";
import { Button } from "@crm/ui/components/button";
import {
	DataTable,
	type DataTableColumn,
	type DataTableFacet,
} from "@crm/ui/components/data-table";
import { EmptyCellValue } from "@crm/ui/components/empty-cell";
import { useTableSelection } from "@crm/ui/hooks/use-table-selection";
import { formatMoney } from "@crm/ui/lib/format";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { CLOSING_OPTIONS } from "@/components/crm/closing-window";
import { CompanyCell } from "@/components/crm/company-cell";
import { useFieldColumns } from "@/components/crm/fields/field-columns";
import { useFieldFacets } from "@/components/crm/fields/field-facets";
import { OwnerCell } from "@/components/crm/owner-cell";
import { usePrefetchRecord } from "@/components/crm/record-sheet/record-prefetch";
import { useOpenRecord } from "@/components/crm/record-sheet/record-stack";
import { DealStageMenu } from "@/components/crm/stage-change";
import { ListSearch } from "@/components/data-table/list-search";
import { useTableQuery } from "@/components/data-table/use-table-query";
import { LocalDay, LocalRelativeTime } from "@/components/local-date-time";
import { t, tf, useLocale } from "@/components/locale-provider";
import { DEAL_STAGE_OPTIONS, dealStageLabel } from "@/lib/deal-stage";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { DealsBulkActions } from "./deals-bulk-actions";
import { dealsSearchParams } from "./deals-search-params";

type DealRow = RouterOutputs["deals"]["list"]["rows"][number];

type HeaderKeyMap = Record<string, { header: string; label?: string }>;

const HEADER_KEYS: HeaderKeyMap = {
	name: { header: "deals.colDeal" },
	company: { header: "common.company" },
	stage: { header: "common.stage" },
	amount: { header: "common.amount" },
	owner: { header: "common.owner" },
	expectedCloseDate: { header: "common.closeDate" },
	createdAt: { header: "common.created", label: "common.createdDate" },
	lastActivity: { header: "common.lastActivity" },
	archivedAt: { header: "common.archived", label: "common.archivedDate" },
} satisfies HeaderKeyMap;

const COLUMNS: DataTableColumn<DealRow>[] = [
	{
		id: "name",
		header: "Deal",
		sortable: true,
		hideable: false,
		width: "w-[24%]",
		cell: (row) => <span className="truncate font-medium">{row.name}</span>,
	},
	{
		id: "company",
		header: "Company",
		sortable: true,
		width: "w-[18%]",
		cell: (row) => <CompanyCell company={row.company} />,
	},
	{
		id: "stage",
		header: "Stage",
		sortable: true,
		width: "w-[18%]",
		cell: (row) => <DealStageMenu dealId={row.id} stage={row.stage} />,
	},
	{
		id: "amount",
		header: "Amount",
		sortable: true,
		align: "right",
		width: "w-[12%]",
		hideBelow: "sm",
		cell: (row) =>
			row.amountCents === null ? (
				<EmptyCellValue />
			) : (
				<span className="tabular-nums">
					{formatMoney(row.amountCents, row.currency)}
				</span>
			),
	},
	{
		id: "owner",
		header: "Owner",
		sortable: true,
		width: "w-[14%]",
		hideBelow: "md",
		cell: (row) => <OwnerCell owner={row.owner} />,
	},
	{
		id: "expectedCloseDate",
		header: "Close date",
		sortable: true,
		width: "w-[12%]",
		hideBelow: "lg",
		cell: (row) =>
			row.expectedCloseDate ? (
				<span className="text-muted-foreground">
					<LocalDay date={row.expectedCloseDate} />
				</span>
			) : (
				<EmptyCellValue />
			),
	},
	{
		id: "createdAt",
		header: "Created",
		label: "Created date",
		sortable: true,
		align: "right",
		width: "w-[10%]",
		defaultHidden: true,
		cell: (row) => (
			<span className="text-muted-foreground">
				<LocalRelativeTime date={row.createdAt} />
			</span>
		),
	},
	{
		id: "lastActivity",
		header: "Last activity",
		sortable: true,
		align: "right",
		width: "w-[12%]",
		hideBelow: "lg",
		cell: (row) => (
			<span className="text-muted-foreground">
				{row.lastActivityAt ? (
					<LocalRelativeTime date={row.lastActivityAt} />
				) : (
					<EmptyCellValue />
				)}
			</span>
		),
	},
];

const ARCHIVED_COLUMN: DataTableColumn<DealRow> = {
	id: "archivedAt",
	header: "Archived",
	label: "Archived date",
	sortable: true,
	align: "right",
	width: "w-[12%]",
	cell: (row) => (
		<span className="text-muted-foreground">
			{row.archivedAt ? (
				<LocalRelativeTime date={row.archivedAt} />
			) : (
				<EmptyCellValue />
			)}
		</span>
	),
};

export function DealsTable() {
	const openRecord = useOpenRecord();
	const trpc = useTRPC();
	const prefetchRecord = usePrefetchRecord();
	const { messages } = useLocale();
	const { query, input, setArchived } = useTableQuery(dealsSearchParams);

	const deals = useQuery({
		...trpc.deals.list.queryOptions(input),
		placeholderData: (previous) => previous,
	});
	const users = useQuery(trpc.users.list.queryOptions());

	const rows = deals.data?.rows ?? [];
	const selection = useTableSelection(
		useMemo(() => rows.map((row) => row.id), [rows]),
	);
	const settledIds = useMemo(() => {
		const matching = new Set(
			rows
				.filter((row) => Boolean(row.archivedAt) === input.archived)
				.map((row) => row.id),
		);
		return selection.ids.filter((id) => matching.has(id));
	}, [rows, input.archived, selection.ids]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: clearing on archived-mode change is the entire purpose of this effect.
	useEffect(() => {
		selection.clear();
	}, [input.archived]);

	const toggleArchived = (next: boolean) => {
		selection.clear();
		if (!next && query.sort === "archivedAt") query.setSort("");
		setArchived(next);
	};

	const facetCounts = deals.data?.facetCounts;
	const fieldFacets = useFieldFacets("DEAL", facetCounts);

	const facets: DataTableFacet[] = [
		{
			id: "owner",
			label: t(messages, "common.owner"),
			options: (users.data ?? []).flatMap((user) =>
				(facetCounts?.owner?.[user.id] ?? 0) > 0
					? [{ value: user.id, label: user.name }]
					: [],
			),
		},
		{
			id: "stage",
			label: t(messages, "deals.facetStage"),
			options: DEAL_STAGE_OPTIONS.flatMap((option) =>
				(facetCounts?.stage?.[option.value] ?? 0) > 0
					? [
							{
								value: option.value,
								label: dealStageLabel(option.value as DealStage, messages),
							},
						]
					: [],
			),
		},
		{
			id: "closing",
			label: t(messages, "deals.facetClosing"),
			options: CLOSING_OPTIONS.flatMap((option) =>
				(facetCounts?.closing?.[option.value] ?? 0) > 0
					? [
							{
								value: option.value,
								label: t(messages, `closing.${option.value}`),
							},
						]
					: [],
			),
		},
		...fieldFacets,
	];

	const openValueCents = deals.data?.openValueCents;
	const reportingCurrency = deals.data?.reportingCurrency;
	const unconverted = deals.data?.unconverted;
	const uncounted = unconverted?.count ?? 0;
	const openPipelineCents = openValueCents ?? (uncounted > 0 ? 0 : null);

	const fieldColumns = useFieldColumns<DealRow>("DEAL");
	const columns = useMemo(
		() =>
			(input.archived
				? [...COLUMNS, ARCHIVED_COLUMN, ...fieldColumns]
				: [...COLUMNS, ...fieldColumns]
			).map((column) => {
				const keys = HEADER_KEYS[column.id];
				if (!keys) return column;
				return {
					...column,
					header: t(messages, keys.header),
					label: keys.label ? t(messages, keys.label) : column.label,
				};
			}),
		[fieldColumns, input.archived, messages],
	);

	return (
		<DataTable
			query={query}
			search={
				<ListSearch placeholder={t(messages, "deals.searchPlaceholder")} />
			}
			actions={
				<Button
					variant={input.archived ? "contrast" : "outline"}
					size="sm"
					className="justify-start sm:justify-center"
					onClick={() => toggleArchived(!input.archived)}
				>
					<Archive data-icon="inline-start" />
					{t(messages, "common.archived")}
				</Button>
			}
			columns={columns}
			rows={rows}
			total={deals.data?.total ?? 0}
			facetCounts={facetCounts}
			facets={facets}
			tabs={{
				id: "status",
				allLabel: t(messages, "deals.allDeals"),
				options: [
					{ value: "open", label: t(messages, "deals.open") },
					{ value: "closed", label: t(messages, "deals.closed") },
				],
			}}
			selection={{
				state: selection,
				actions: (
					<DealsBulkActions
						ids={settledIds}
						onDone={selection.clear}
						archived={input.archived}
					/>
				),
				rowLabel: (row) => row.name,
			}}
			getRowId={(row) => row.id}
			loading={deals.isFetching}
			onRowHover={(row) => prefetchRecord({ kind: "deal", id: row.id })}
			onRowClick={(row) => openRecord({ kind: "deal", id: row.id })}
			empty={
				input.archived
					? t(messages, "deals.emptyArchived")
					: t(messages, "deals.empty")
			}
			meta={
				input.archived || openPipelineCents === null ? undefined : (
					<span>
						{deals.data?.total ?? 0} {t(messages, "nav.deals")} ·{" "}
						<span className="tabular-nums">
							{formatMoney(openPipelineCents, reportingCurrency)}
						</span>{" "}
						{t(messages, "deals.openPipelineMeta")}
						{unconverted && unconverted.count > 0 ? (
							<span className="text-muted-foreground">
								{" "}
								·{" "}
								{tf(messages, "deals.notCounted", {
									currencies: unconverted.currencies.join(", "),
								})}
							</span>
						) : null}
					</span>
				)
			}
		/>
	);
}
