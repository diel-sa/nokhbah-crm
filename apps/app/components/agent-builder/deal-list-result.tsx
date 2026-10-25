"use client";

import { EmptyCellValue } from "@crm/ui/components/empty-cell";
import { Money } from "@crm/ui/components/money";
import {
	SimpleTable,
	type SimpleTableColumn,
	SimpleTableRow,
} from "@crm/ui/components/simple-table";
import { TableCell } from "@crm/ui/components/table";
import { formatMoney } from "@crm/ui/lib/format";
import { CompanyCell } from "@/components/crm/company-cell";
import { DealStageIndicator } from "@/components/crm/deal-stage";
import { OwnerCell } from "@/components/crm/owner-cell";
import { usePrefetchRecord } from "@/components/crm/record-sheet/record-prefetch";
import { useOpenRecord } from "@/components/crm/record-sheet/record-stack";
import { LocalDay } from "@/components/local-date-time";
import { t, tf, useLocale } from "@/components/locale-provider";
import type { DealListItem, DealListResult } from "@/lib/agent-transcript";
import { DEAL_STAGE_OPTIONS } from "@/lib/deal-stage";
import type { Messages } from "@/lib/i18n/messages";

function dealStatusLabel(messages: Messages, status: string): string | null {
	const map = messages.chat.deal.dealStatus as Record<
		string,
		string | undefined
	>;
	return map[status] ?? null;
}

function columnsOf(messages: Messages): SimpleTableColumn[] {
	return [
		{
			id: "deal",
			header: t(messages, "chat.deal.columns.deal"),
			width: "w-[20%]",
		},
		{
			id: "company",
			header: t(messages, "chat.deal.columns.company"),
			width: "w-[18%]",
		},
		{
			id: "stage",
			header: t(messages, "chat.deal.columns.stage"),
			width: "w-[18%]",
		},
		{
			id: "amount",
			header: t(messages, "chat.deal.columns.amount"),
			width: "w-[12%]",
			align: "right",
		},
		{
			id: "owner",
			header: t(messages, "chat.deal.columns.owner"),
			width: "w-[14%]",
		},
		{
			id: "close",
			header: t(messages, "chat.deal.columns.closeDate"),
			width: "w-[12%]",
		},
		{
			id: "idle",
			header: t(messages, "chat.deal.columns.idle"),
			width: "w-[8%]",
			align: "right",
		},
	];
}

export function DealListResultTable({ result }: { result: DealListResult }) {
	const { messages } = useLocale();
	const openRecord = useOpenRecord();
	const prefetchRecord = usePrefetchRecord();
	const count = result.deals.length;
	const title = tableTitle(result, messages);

	return (
		<section aria-label={title} className="flex w-full flex-col gap-3">
			<SimpleTable
				columns={columnsOf(messages)}
				className="min-w-[56rem] table-fixed [&_td:first-child]:ps-4 [&_td:last-child]:pe-4 [&_th:first-child]:ps-4 [&_th:last-child]:pe-4"
				headerHeight="h-11"
			>
				{count === 0 ? (
					<SimpleTableRow>
						<TableCell
							colSpan={columnsOf(messages).length}
							className="h-32 whitespace-normal py-8 text-center align-middle text-muted-foreground"
						>
							{t(messages, "chat.deal.noDeals")}
						</TableCell>
					</SimpleTableRow>
				) : (
					result.deals.map((deal) => {
						const record = { kind: "deal" as const, id: deal.id };

						return (
							<SimpleTableRow
								key={deal.id}
								clickable
								onClick={() => openRecord(record)}
								onFocus={() => prefetchRecord(record)}
								onMouseEnter={() => prefetchRecord(record)}
							>
								<TableCell className="overflow-hidden px-3 py-3">
									<span className="block truncate font-medium">
										{deal.name}
									</span>
								</TableCell>
								<TableCell className="overflow-hidden px-3 py-3">
									<CompanyCell company={deal.company} />
								</TableCell>
								<TableCell className="overflow-hidden px-3 py-3">
									<Stage stage={deal.stage} />
								</TableCell>
								<TableCell className="overflow-hidden px-3 py-3 text-right">
									{deal.amount === null ? (
										<EmptyCellValue />
									) : (
										<Money
											cents={Math.round(deal.amount * 100)}
											currency={deal.currency}
										/>
									)}
								</TableCell>
								<TableCell className="overflow-hidden px-3 py-3">
									<OwnerCell owner={deal.owner} />
								</TableCell>
								<TableCell className="overflow-hidden px-3 py-3">
									{deal.expectedCloseDate ? (
										<span className="text-muted-foreground">
											<LocalDay date={deal.expectedCloseDate} />
										</span>
									) : (
										<EmptyCellValue />
									)}
								</TableCell>
								<TableCell
									className="overflow-hidden px-3 py-3 text-right text-muted-foreground tabular-nums"
									title={
										deal.neverActive
											? t(messages, "chat.deal.noActivity")
											: undefined
									}
								>
									{tf(messages, "chat.deal.days", {
										count: deal.daysSinceLastActivity,
									})}
								</TableCell>
							</SimpleTableRow>
						);
					})
				)}
			</SimpleTable>
			<div className="flex flex-wrap items-center justify-between gap-3 text-muted-foreground text-xs">
				<span>{tableMeta(result, messages)}</span>
				<span>
					{tf(messages, "chat.deal.asOf", { date: "" })}
					<LocalDay date={result.asOf} />
				</span>
			</div>
		</section>
	);
}

function Stage({ stage }: { stage: string }) {
	const option = DEAL_STAGE_OPTIONS.find(
		(candidate) => candidate.value === stage,
	);
	return option ? (
		<DealStageIndicator stage={option.value} />
	) : (
		<span className="text-muted-foreground">{humaniseStage(stage)}</span>
	);
}

function tableTitle(result: DealListResult, messages: Messages): string {
	const count = result.deals.length;
	if (count === 0) return t(messages, "chat.deal.noMatching");
	const statusValue = dealStatusLabel(messages, result.criteria.status);
	const statusWord =
		result.criteria.status === "all"
			? ""
			: `${statusValue ?? result.criteria.status} `;
	const staleWord =
		result.criteria.inactiveForDays === null
			? ""
			: `${t(messages, "chat.deal.stale")} `;
	const countWord = tf(
		messages,
		count === 1 ? "chat.deal.dealCountOne" : "chat.deal.dealCountMany",
		{ count },
	);
	return `${countWord} ${staleWord}${statusWord}`.trim();
}

function tableMeta(result: DealListResult, messages: Messages): string {
	const details = [
		tf(
			messages,
			result.deals.length === 1
				? "chat.deal.dealCountOne"
				: "chat.deal.dealCountMany",
			{ count: result.deals.length },
		),
		pipelineTotal(result.deals, messages),
		result.criteria.inactiveForDays === null
			? null
			: tf(messages, "chat.deal.inactiveDays", {
					count: result.criteria.inactiveForDays,
				}),
		result.hasMore ? t(messages, "chat.deal.moreResults") : null,
	].filter((detail): detail is string => Boolean(detail));

	return details.join(" · ");
}

function humaniseStage(stage: string): string {
	return stage
		.toLowerCase()
		.split("_")
		.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
		.join(" ");
}

function pipelineTotal(
	deals: readonly DealListItem[],
	messages: Messages,
): string | null {
	const currencies = new Set(deals.map((deal) => deal.currency));
	if (currencies.size !== 1) return null;

	const currency = currencies.values().next().value;
	if (!currency) return null;

	const amount = deals.reduce((sum, deal) => sum + (deal.amount ?? 0), 0);
	return tf(messages, "chat.deal.pipeline", {
		total: formatMoney(Math.round(amount * 100), currency),
	});
}
