"use client";

import Add from "@carbon/icons-react/es/Add";
import Close from "@carbon/icons-react/es/Close";
import { FIELD_TYPES, fieldKeyFromLabel } from "@crm/db/fields-shape";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@crm/ui/components/alert-dialog";
import { Button } from "@crm/ui/components/button";
import { Checkbox } from "@crm/ui/components/checkbox";
import {
	Field,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@crm/ui/components/field";
import { Icon } from "@crm/ui/components/icon";
import { Input } from "@crm/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@crm/ui/components/select";
import { SortableItem, SortableList } from "@crm/ui/components/sortable-list";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { Switch } from "@crm/ui/components/switch";
import { Textarea } from "@crm/ui/components/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import {
	fieldFormat,
	fieldText,
	filterPlacement,
	optionLabel,
	sheetPlacement,
	tablePlacement,
	typeHint,
} from "./fields-copy";
import { type FieldEntity, kindOf } from "./fields-entity";

type FieldRecord = RouterOutputs["fields"]["list"][number];

type Draft = {
	label: string;
	type: (typeof FIELD_TYPES)[number];
	options: { id?: string; label: string }[];
	agentFilled: boolean;
	agentBrief: string;
	showOnSheet: boolean;
	showOnTable: boolean;
	showOnFilter: boolean;
};

function optionId(option: { id?: string }, index: number): string {
	return option.id ?? `draft-${index}`;
}

const SECTION = "flex flex-col gap-4 border-b px-5 py-4";

function draftFrom(field: FieldRecord | undefined): Draft {
	return {
		label: field?.label ?? "",
		type: field?.type ?? "TEXT",
		options:
			field?.options.map((option) => ({
				id: option.id,
				label: option.label,
			})) ?? [],
		agentFilled: field?.agentFilled ?? true,
		agentBrief: field?.agentBrief ?? "",
		showOnSheet: field?.showOnSheet ?? true,
		showOnTable: field?.showOnTable ?? false,
		showOnFilter: field?.showOnFilter ?? false,
	};
}

function Coverage({ field }: { field: FieldRecord }) {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const { messages } = useLocale();
	const coverage = useQuery(
		trpc.fields.coverage.queryOptions({ id: field.id }),
	);

	const backfill = useMutation(
		trpc.fields.backfill.mutationOptions({
			onSuccess: async () => {
				toast.success(fieldText(messages, "agentsWillPickUp"));
				await cache.fieldCoverage(field.id);
			},
			onError: () => toast.error(fieldText(messages, "backfillError")),
		}),
	);

	if (!field.agentFilled || !coverage.data) return null;

	const { filled, total } = coverage.data;
	const noun = fieldText(messages, `entityPlural.${field.entity}`);
	const covered = filled >= total;

	return (
		<div className="shrink-0 border-t px-5 py-3">
			<div className="flex items-center gap-3 rounded-md bg-muted p-3">
				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<StatusIndicator
						tone="primary"
						className="font-medium text-foreground"
						label={fieldFormat(messages, "filledOn", {
							filled,
							total,
							noun,
						})}
					/>
					<span className="ps-4 text-muted-foreground text-xs">
						{covered
							? fieldText(messages, "allFilled")
							: fieldFormat(messages, "stillToGo", { count: total - filled })}
					</span>
				</div>
				<Button
					variant="outline"
					size="sm"
					disabled={backfill.isPending || covered}
					onClick={() => backfill.mutate({ id: field.id })}
				>
					{fieldText(messages, "fillRest")}
				</Button>
			</div>
		</div>
	);
}

export function FieldEditor({
	entity,
	field,
	onDone,
}: {
	entity: FieldEntity;
	field: FieldRecord | undefined;
	onDone: () => void;
}) {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const { messages } = useLocale();
	const labelId = useId();
	const briefId = useId();
	const agentId = useId();
	const typeId = useId();
	const optionsId = useId();

	const [draft, setDraft] = useState<Draft>(() => draftFrom(field));
	const [confirming, setConfirming] = useState(false);

	const patch = (next: Partial<Draft>) =>
		setDraft((current) => ({ ...current, ...next }));

	const settle = async () => {
		await cache.fields(kindOf(entity));
		onDone();
	};

	const create = useMutation(
		trpc.fields.create.mutationOptions({
			onSuccess: settle,
			onError: () => toast.error(fieldText(messages, "saveError")),
		}),
	);

	const update = useMutation(
		trpc.fields.update.mutationOptions({
			onSuccess: settle,
			onError: () => toast.error(fieldText(messages, "saveError")),
		}),
	);

	const archive = useMutation(
		trpc.fields.archive.mutationOptions({
			onSuccess: settle,
			onError: () => toast.error(fieldText(messages, "archiveError")),
		}),
	);

	const key = field?.key ?? fieldKeyFromLabel(draft.label);
	const saving = create.isPending || update.isPending;
	const filterable = draft.type === "SELECT" || draft.type === "USER";

	const save = () => {
		const payload = {
			label: draft.label,
			type: draft.type,
			options: draft.options.filter((option) => option.label.trim() !== ""),
			agentFilled: draft.agentFilled,
			agentBrief: draft.agentBrief.trim() || null,
			showOnSheet: draft.showOnSheet,
			showOnTable: draft.showOnTable,
			showOnFilter: filterable && draft.showOnFilter,
		};

		if (field) {
			update.mutate({ id: field.id, data: payload });
			return;
		}

		create.mutate({ ...payload, entity, required: false });
	};

	return (
		<>
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
				<div className={SECTION}>
					<Field>
						<FieldLabel htmlFor={labelId}>
							{fieldText(messages, "label")}
						</FieldLabel>
						<Input
							id={labelId}
							value={draft.label}
							onChange={(event) => patch({ label: event.target.value })}
						/>
					</Field>

					<Field>
						<div className="flex items-baseline justify-between gap-2">
							<FieldTitle>{fieldText(messages, "key")}</FieldTitle>
							<span className="font-mono text-muted-foreground text-xs">
								{key || "—"}
							</span>
						</div>
						<FieldDescription>
							{fieldText(messages, "keyHelp")}
						</FieldDescription>
					</Field>
				</div>

				<div className={SECTION}>
					<Field orientation="horizontal">
						<div className="flex min-w-0 flex-1 flex-col gap-0.5">
							<FieldLabel htmlFor={agentId}>
								{fieldText(messages, "letAgentsFill")}
							</FieldLabel>
							<FieldDescription>
								{fieldText(messages, "agentHelp")}
							</FieldDescription>
						</div>
						<Switch
							id={agentId}
							checked={draft.agentFilled}
							onCheckedChange={(agentFilled) => patch({ agentFilled })}
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor={briefId}>
							{fieldText(messages, "briefLabel")}
						</FieldLabel>
						<Textarea
							id={briefId}
							rows={3}
							value={draft.agentBrief}
							onChange={(event) => patch({ agentBrief: event.target.value })}
						/>
						<FieldDescription>
							{fieldText(messages, "briefHelp")}
						</FieldDescription>
					</Field>
				</div>

				<div className={SECTION}>
					<Field>
						<FieldLabel htmlFor={typeId}>
							{fieldText(messages, "type")}
						</FieldLabel>
						<Select
							value={draft.type}
							onValueChange={(value) => patch({ type: value as Draft["type"] })}
						>
							<SelectTrigger id={typeId} className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{FIELD_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{typeHint(messages, type)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>

					{draft.type === "SELECT" ? (
						<Field aria-labelledby={optionsId}>
							<FieldTitle id={optionsId}>
								{fieldText(messages, "options")}
							</FieldTitle>
							<SortableList
								ids={draft.options.map(optionId)}
								onReorder={(ids) =>
									patch({
										options: ids
											.map((id) =>
												draft.options.find(
													(option, at) => optionId(option, at) === id,
												),
											)
											.filter((option): option is Draft["options"][number] =>
												Boolean(option),
											),
									})
								}
							>
								<div className="flex flex-col gap-1.5">
									{draft.options.map((option, index) => (
										<SortableItem
											key={optionId(option, index)}
											id={optionId(option, index)}
											label={option.label || optionLabel(messages, index)}
										>
											<Input
												aria-label={optionLabel(messages, index)}
												value={option.label}
												onChange={(event) =>
													patch({
														options: draft.options.map((entry, at) =>
															at === index
																? { ...entry, label: event.target.value }
																: entry,
														),
													})
												}
											/>
											<Button
												variant="ghost"
												size="icon-xs"
												onClick={() =>
													patch({
														options: draft.options.filter(
															(_, at) => at !== index,
														),
													})
												}
											>
												<Icon icon={Close} />
												<span className="sr-only">
													{fieldFormat(messages, "removeOption", {
														label: optionLabel(messages, index),
													})}
												</span>
											</Button>
										</SortableItem>
									))}
								</div>
							</SortableList>
							<Button
								variant="ghost"
								size="sm"
								className="self-start"
								onClick={() =>
									patch({ options: [...draft.options, { label: "" }] })
								}
							>
								<Icon icon={Add} data-icon="inline-start" />
								{fieldText(messages, "addOption")}
							</Button>
						</Field>
					) : null}
				</div>

				<div className="flex flex-col gap-2.5 border-b px-5 py-4">
					<FieldLabel className="items-center gap-2 font-normal">
						<Checkbox
							checked={draft.showOnSheet}
							onCheckedChange={(checked) =>
								patch({ showOnSheet: checked === true })
							}
						/>
						{sheetPlacement(messages, entity)}
					</FieldLabel>
					<FieldLabel className="items-center gap-2 font-normal">
						<Checkbox
							checked={draft.showOnTable}
							onCheckedChange={(checked) =>
								patch({ showOnTable: checked === true })
							}
						/>
						{tablePlacement(messages, entity)}
					</FieldLabel>
					{filterable ? (
						<FieldLabel className="items-center gap-2 font-normal">
							<Checkbox
								checked={draft.showOnFilter}
								onCheckedChange={(checked) =>
									patch({ showOnFilter: checked === true })
								}
							/>
							{filterPlacement(messages, entity)}
						</FieldLabel>
					) : null}
				</div>
			</div>

			{field ? <Coverage field={field} /> : null}

			<div className="flex shrink-0 items-center gap-2 border-t px-5 py-3">
				<Button disabled={saving || draft.label.trim() === ""} onClick={save}>
					{field
						? fieldText(messages, "saveChanges")
						: fieldText(messages, "createField")}
				</Button>
				{field ? (
					<Button variant="outline" onClick={() => setConfirming(true)}>
						{fieldText(messages, "archive")}
					</Button>
				) : (
					<Button variant="outline" onClick={onDone}>
						{fieldText(messages, "cancel")}
					</Button>
				)}
			</div>

			{field ? (
				<AlertDialog open={confirming} onOpenChange={setConfirming}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{fieldFormat(messages, "archiveFieldTitle", {
									label: field.label,
								})}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{fieldText(messages, "archiveFieldDescription")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								{fieldText(messages, "cancel")}
							</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								onClick={() => archive.mutate({ id: field.id })}
							>
								{fieldText(messages, "archiveFieldConfirm")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			) : null}
		</>
	);
}
