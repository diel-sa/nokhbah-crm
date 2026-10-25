"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import type { ChartConfig } from "@crm/ui/components/chart";
import { DashboardRow, StatGroup } from "@crm/ui/components/dashboard";
import { Money } from "@crm/ui/components/money";
import { StatCard, type StatDelta } from "@crm/ui/components/stat-card";
import { formatPercent } from "@crm/ui/lib/format";
import Link from "next/link";
import type { ReactNode } from "react";
import { AreaTrend, DonutStat } from "@/components/dashboard-charts";
import { t, tf, useLocale } from "@/components/locale-provider";
import { dealStageColor, dealStageLabel } from "@/lib/deal-stage";
import { formatCountL } from "@/lib/i18n/format-count";
import type { RouterOutputs } from "@/lib/trpc/types";
import { useWorkspaceUrl } from "@/lib/use-workspace-url";

type Summary = RouterOutputs["dashboard"]["summary"];

function trendConfig(labels: { won: string; created: string }): ChartConfig {
	return {
		won: { label: labels.won, color: "var(--success)" },
		created: { label: labels.created, color: "var(--chart-1)" },
	};
}

function changeDelta(
	current: number,
	previous: number,
	label: string,
): StatDelta | undefined {
	if (previous === 0) return undefined;
	const change = Math.round(((current - previous) / previous) * 100);
	return {
		value: `${change >= 0 ? "+" : ""}${change}%`,
		direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
		label,
	};
}

export function SalesDashboard({ summary }: { summary: Summary }) {
	const workspaceUrl = useWorkspaceUrl();
	const { messages } = useLocale();
	const config = trendConfig({
		won: t(messages, "dashboard.closedWon"),
		created: t(messages, "dashboard.newPipeline"),
	});

	const {
		pipeline,
		wonThisMonth,
		wonPrevMonth,
		performance,
		trend,
		closingThisMonthTotal,
		reportingCurrency,
		unconverted,
	} = summary;

	const money = (cents: number) => (
		<Money cents={cents} currency={reportingCurrency} compact />
	);
	const exact = (value: number | string) => (
		<Money cents={Number(value)} currency={reportingCurrency} />
	);

	const hasTrend = trend.some((point) => point.won > 0 || point.created > 0);

	const stageSlices = pipeline.stages.flatMap((stage) =>
		stage.valueCents > 0
			? [
					{
						key: stage.stage,
						label: dealStageLabel(stage.stage, messages),
						value: stage.valueCents,
						color: dealStageColor(stage.stage),
						count: stage.count,
					},
				]
			: [],
	);

	return (
		<div className="flex flex-col gap-6">
			<StatGroup>
				<StatCard
					label={t(messages, "dashboard.closedWonThisMonth")}
					value={money(wonThisMonth.valueCents)}
					delta={changeDelta(
						wonThisMonth.valueCents,
						wonPrevMonth.valueCents,
						t(messages, "dashboard.vsLastMonth"),
					)}
					description={
						<>
							{formatCountL(messages, wonThisMonth.count, "deal")} ·{" "}
							{money(wonPrevMonth.valueCents)}{" "}
							{t(messages, "dashboard.lastMonth")}
						</>
					}
				/>
				<StatCard
					label={t(messages, "dashboard.openPipeline")}
					value={money(pipeline.totalCents)}
					description={
						<>
							{formatCountL(messages, pipeline.totalDeals, "deal")}{" "}
							{t(messages, "dashboard.inProgress")} ·{" "}
							{money(closingThisMonthTotal.valueCents)}{" "}
							{t(messages, "dashboard.dueThisMonth")}
						</>
					}
				/>
				<StatCard
					label={tf(messages, "dashboard.winRate", {
						days: performance.windowDays,
					})}
					value={
						performance.winRate === null
							? "—"
							: formatPercent(performance.winRate)
					}
					description={
						performance.wins + performance.losses === 0
							? t(messages, "dashboard.nothingClosedYet")
							: tf(messages, "dashboard.wonLost", {
									won: performance.wins,
									lost: performance.losses,
								})
					}
				/>
				<StatCard
					label={tf(messages, "dashboard.avgDeal", {
						days: performance.windowDays,
					})}
					value={
						performance.avgDealCents === null
							? "—"
							: money(performance.avgDealCents)
					}
					description={
						performance.avgCycleDays === null
							? t(messages, "dashboard.noWinsToMeasure")
							: tf(messages, "dashboard.avgCycle", {
									days: performance.avgCycleDays,
								})
					}
				/>
			</StatGroup>

			{unconverted.count > 0 ? (
				<p className="text-muted-foreground text-xs">
					{tf(messages, "dashboard.unconvertedNote", {
						currency: reportingCurrency,
						count: unconverted.count,
					})}{" "}
					<Link
						href={workspaceUrl("/settings/currencies")}
						className="underline hover:no-underline"
					>
						{t(messages, "dashboard.setOne")}
					</Link>
					.
				</p>
			) : null}

			<DashboardRow split="hero">
				<ChartPanel
					title={t(messages, "dashboard.chartClosedVsNew")}
					description={t(messages, "dashboard.chartClosedVsNewDesc")}
				>
					{hasTrend ? (
						<div className="flex flex-1 flex-col justify-center py-4">
							<AreaTrend
								data={trend}
								config={config}
								xKey="month"
								height={196}
								variant="gradient"
								bloom="high"
								showLegend
								formatValue={exact}
							/>
						</div>
					) : (
						<EmptyChart label={t(messages, "dashboard.noDealsYet")} />
					)}
				</ChartPanel>

				<ChartPanel
					title={t(messages, "dashboard.chartByStage")}
					description={t(messages, "dashboard.chartByStageDesc")}
				>
					{stageSlices.length > 0 ? (
						<div className="flex flex-1 flex-col justify-between gap-1 pt-4">
							<DonutStat
								data={stageSlices}
								height={168}
								centerValue={money(pipeline.totalCents)}
								centerLabel={t(messages, "dashboard.open")}
								formatValue={exact}
							/>
							<ul className="flex flex-col px-5 pb-1 md:px-6">
								{stageSlices.map((slice) => (
									<li key={slice.key} className="border-t first:border-t-0">
										<Link
											href={`${workspaceUrl("/deals")}?stage=${slice.key}`}
											className="flex items-center gap-2.5 py-2 text-xs hover:underline"
										>
											<span
												aria-hidden
												className="size-1.5 shrink-0"
												style={{ backgroundColor: slice.color }}
											/>
											<span className="min-w-0 flex-1 truncate">
												{slice.label}
											</span>
											<span className="shrink-0 text-muted-foreground tabular-nums">
												{slice.count}
											</span>
											<span className="w-14 shrink-0 text-right font-medium tabular-nums">
												{money(slice.value)}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					) : (
						<EmptyChart label={t(messages, "dashboard.nothingOpen")} />
					)}
				</ChartPanel>
			</DashboardRow>
		</div>
	);
}

function ChartPanel({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<Card className="min-w-0">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
			</CardHeader>
			<div className="flex flex-1 flex-col border">{children}</div>
		</Card>
	);
}

function EmptyChart({ label }: { label: string }) {
	return (
		<div className="flex flex-1 items-center justify-center px-5 py-10 text-muted-foreground text-sm md:px-6">
			{label}
		</div>
	);
}
