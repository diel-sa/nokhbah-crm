"use client";

import Add from "@carbon/icons-react/es/Add";
import Close from "@carbon/icons-react/es/Close";
import UserMultiple from "@carbon/icons-react/es/UserMultiple";
import { CURRENCIES, normalizeCurrency } from "@crm/db/currency";
import type { FieldValueJson } from "@crm/db/fields";
import { Button } from "@crm/ui/components/button";
import { EmptyCellValue } from "@crm/ui/components/empty-cell";
import {
	EntityLogo,
	type EntityLogoTone,
} from "@crm/ui/components/entity-logo";
import { Icon } from "@crm/ui/components/icon";
import { Money } from "@crm/ui/components/money";
import { PersonAvatar } from "@crm/ui/components/person-avatar";
import { SimpleTable, SimpleTableRow } from "@crm/ui/components/simple-table";
import { TableCell } from "@crm/ui/components/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@crm/ui/components/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AgentPanel } from "@/components/crm/agent-panel";
import { InlineCompanyField } from "@/components/crm/company-picker";
import { contactName } from "@/components/crm/contact-name";
import { FieldsCog, RecordFields } from "@/components/crm/fields/record-fields";
import {
	InlineDateField,
	InlineField,
	InlineSelectField,
	InlineTextArea,
	InlineTextCell,
	savingValue,
} from "@/components/crm/inline-field";
import { OwnerCell } from "@/components/crm/owner-cell";
import { DealStageMenu } from "@/components/crm/stage-change";
import { StageStepper } from "@/components/crm/stage-stepper";
import { Timeline } from "@/components/crm/timeline/timeline";
import {
	DetailSheetBody,
	DetailSheetEmpty,
	DetailSheetProperties,
	DetailSheetProperty,
	DetailSheetSection,
	DetailSheetStat,
	DetailSheetStats,
	type DetailSheetTab,
} from "@/components/detail-sheet";
import {
	LocalDateTime,
	LocalDay,
	LocalRelativeTime,
} from "@/components/local-date-time";
import { t, tf, useLocale } from "@/components/locale-provider";
import { localizedCurrencyName } from "@/lib/i18n/currency-name";
import { savingField } from "@/lib/pending-field";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { AttachDealContact } from "./quick-add";
import { RecordActions } from "./record-actions";
import { AddRow, RecordSheetFrame } from "./record-parts";
import { useOpenRecord, useRecordSheetView } from "./record-stack";

type Deal = RouterOutputs["deals"]["byId"];

function dealCurrency(currency: string) {
	return normalizeCurrency(currency) || currency;
}

function currencyOptions(
	currency: string,
	messages: ReturnType<typeof useLocale>["messages"],
) {
	const options = CURRENCIES.map((entry) => ({
		value: entry.code,
		label: `${entry.code} · ${localizedCurrencyName(entry.code, messages)}`,
	}));

	if (options.some((option) => option.value === currency)) {
		return options;
	}

	return [
		{
			value: currency,
			label: tf(messages, "dealSheet.unsupportedCurrency", { currency }),
		},
		...options,
	];
}

function ReportedValue({ deal }: { deal: Deal }) {
	const { messages } = useLocale();
	const currency = dealCurrency(deal.currency);

	if (currency === deal.reportingCurrency) return null;
	if (deal.amountCents === null) return null;

	return (
		<DetailSheetProperty
			label={tf(messages, "dealSheet.reportingCurrency", {
				currency: deal.reportingCurrency,
			})}
		>
			{deal.baseAmountCents === null ? (
				<span className="text-muted-foreground">
					{tf(messages, "dealSheet.noCurrencyRate", { currency })}
				</span>
			) : (
				<span className="text-muted-foreground">
					≈{" "}
					<Money
						cents={deal.baseAmountCents}
						currency={deal.reportingCurrency}
					/>
				</span>
			)}
		</DetailSheetProperty>
	);
}

function contactColumns(messages: ReturnType<typeof useLocale>["messages"]) {
	return [
		{
			id: "name",
			header: t(messages, "dealSheet.contactColumns.name"),
			width: "w-[28%]",
			className: "ps-5",
		},
		{
			id: "role",
			header: t(messages, "dealSheet.contactColumns.role"),
			width: "w-[20%]",
		},
		{
			id: "title",
			header: t(messages, "dealSheet.contactColumns.title"),
			width: "w-[22%]",
		},
		{
			id: "email",
			header: t(messages, "dealSheet.contactColumns.email"),
			width: "w-[22%]",
		},
		{
			id: "remove",
			srLabel: t(messages, "dealSheet.contactColumns.remove"),
			width: "w-10",
		},
	];
}

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	month: "short",
	day: "numeric",
	year: "numeric",
};

export function DealSheet({ dealId }: { dealId: string }) {
	const trpc = useTRPC();
	const openRecord = useOpenRecord();
	const { messages } = useLocale();
	const {
		tab,
		setTab,
		form: adding,
		setForm: setAdding,
	} = useRecordSheetView("overview");

	const query = useQuery(trpc.deals.byId.queryOptions({ id: dealId }));
	const deal = query.data;

	const tabs: DetailSheetTab[] = deal
		? [
				{
					value: "overview",
					label: t(messages, "recordSheet.overview"),
					content: <DealOverview deal={deal} />,
				},
				{
					value: "contacts",
					label: t(messages, "recordSheet.contacts"),
					count: deal.contacts.length,
					content: (
						<DealContacts
							deal={deal}
							adding={adding === "contact"}
							onAdd={() => setAdding("contact")}
							onDone={() => setAdding(null)}
						/>
					),
				},
				{
					value: "activity",
					label: t(messages, "recordSheet.activity"),
					content: <Timeline anchor={{ dealId: deal.id }} />,
				},
				{
					value: "agent",
					label: t(messages, "recordSheet.agent"),
					content: <AgentPanel record={{ kind: "deal", id: deal.id }} />,
					keepMounted: true,
				},
			]
		: [];

	return (
		<RecordSheetFrame
			loading={query.isPending}
			error={query.error ? t(messages, "dealSheet.loadError") : null}
			title={deal?.name ?? t(messages, "dealSheet.titleFallback")}
			description={
				deal ? (
					<button
						type="button"
						onClick={() => openRecord({ kind: "company", id: deal.company.id })}
						className="text-foreground underline-offset-2 hover:underline"
					>
						{deal.company.name}
					</button>
				) : undefined
			}
			media={
				deal ? (
					<EntityLogo
						src={deal.company.iconUrl}
						darkSrc={deal.company.iconDarkUrl}
						tone={deal.company.iconTone as EntityLogoTone | null | undefined}
						name={deal.company.name}
						size="lg"
					/>
				) : null
			}
			actions={
				deal ? (
					<>
						<DealStageMenu
							dealId={deal.id}
							stage={deal.stage}
							variant="control"
						/>
						<RecordActions
							record={{ kind: "deal", id: deal.id }}
							name={deal.name}
							consequence={tf(messages, "dealSheet.deleteConsequence", {
								company: deal.company.name,
							})}
							archivedAt={deal.archivedAt}
						/>
					</>
				) : null
			}
			stats={
				deal ? (
					<DetailSheetStats>
						<DetailSheetStat label={t(messages, "dealSheet.stats.amount")}>
							{deal.amountCents === null ? (
								<EmptyCellValue />
							) : (
								<Money
									cents={deal.amountCents}
									currency={dealCurrency(deal.currency)}
								/>
							)}
						</DetailSheetStat>
						<DetailSheetStat
							label={t(messages, "dealSheet.stats.expectedClose")}
						>
							{deal.expectedCloseDate ? (
								<LocalDay date={deal.expectedCloseDate} />
							) : (
								<EmptyCellValue />
							)}
						</DetailSheetStat>
						<DetailSheetStat label={t(messages, "dealSheet.stats.inStage")}>
							<LocalRelativeTime date={deal.stageChangedAt} />
						</DetailSheetStat>
						<DetailSheetStat label={t(messages, "dealSheet.stats.owner")}>
							<OwnerCell owner={deal.owner} />
						</DetailSheetStat>
					</DetailSheetStats>
				) : null
			}
			tabs={tabs}
			tab={tab}
			onTabChange={setTab}
		/>
	);
}

function DealOverview({ deal }: { deal: Deal }) {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const { messages } = useLocale();

	const users = useQuery(trpc.users.list.queryOptions());

	const update = useMutation(
		trpc.deals.update.mutationOptions({
			onSuccess: () => cache.deal(deal.id, { settle: "record" }),
			onError: () => toast.error(t(messages, "dealSheet.saveError")),
		}),
	);

	const saveFields = (fields: Record<string, FieldValueJson>) =>
		update.mutate({ id: deal.id, data: { fields } });

	const isSavingField = savingValue(update);

	const save = (data: Parameters<typeof update.mutate>[0]["data"]) =>
		update.mutate({ id: deal.id, data });

	const currency = dealCurrency(deal.currency);

	const isSaving = savingField(update);

	return (
		<DetailSheetBody>
			<DetailSheetSection title={t(messages, "dealSheet.stage")}>
				<StageStepper dealId={deal.id} stage={deal.stage} />

				{deal.closedReason ? (
					<DetailSheetProperties>
						<DetailSheetProperty label={t(messages, "dealSheet.closed")}>
							{deal.closedAt ? (
								<LocalDateTime date={deal.closedAt} options={DATE_OPTIONS} />
							) : (
								<EmptyCellValue />
							)}
						</DetailSheetProperty>
						<DetailSheetProperty label={t(messages, "dealSheet.reason")} wide>
							{deal.closedReason}
						</DetailSheetProperty>
					</DetailSheetProperties>
				) : null}
			</DetailSheetSection>

			<DetailSheetSection
				title={t(messages, "dealSheet.details")}
				action={<FieldsCog kind="deal" />}
			>
				<DetailSheetProperties>
					<InlineField
						label={t(messages, "dealSheet.name")}
						value={deal.name}
						saving={isSaving("name")}
						onSave={(name) => name && save({ name })}
					/>
					<InlineField
						label={t(messages, "dealSheet.amount")}
						value={
							deal.amountCents === null ? null : String(deal.amountCents / 100)
						}
						placeholder="24000"
						saving={isSaving("amountCents")}
						onSave={(next) => {
							if (next === "") return save({ amountCents: null });
							const parsed = Number.parseFloat(next);
							if (!Number.isFinite(parsed) || parsed < 0) {
								toast.error(t(messages, "dealSheet.amountInvalid"));
								return;
							}
							save({ amountCents: Math.round(parsed * 100) });
						}}
						render={(value) => (
							<Money
								cents={Math.round(Number(value) * 100)}
								currency={currency}
							/>
						)}
					/>
					<InlineSelectField
						label={t(messages, "dealSheet.currency")}
						value={currency}
						options={currencyOptions(currency, messages)}
						onSave={(currency) => save({ currency })}
					/>
					<ReportedValue deal={deal} />
					<InlineDateField
						label={t(messages, "dealSheet.closeDate")}
						value={deal.expectedCloseDate}
						saving={isSaving("expectedCloseDate")}
						onSave={(next) => save({ expectedCloseDate: next || null })}
					/>
					<InlineCompanyField
						label={t(messages, "dealSheet.company")}
						value={deal.company.id}
						company={deal.company}
						saving={isSaving("companyId")}
						onSave={(companyId) => save({ companyId })}
					/>
					<InlineSelectField
						label={t(messages, "dealSheet.owner")}
						value={deal.owner.id}
						options={(users.data ?? []).map((user) => ({
							value: user.id,
							label: user.name,
						}))}
						onSave={(ownerId) => save({ ownerId })}
					/>
					<RecordFields
						fields={deal.fields}
						saving={isSavingField}
						onSave={saveFields}
					/>
				</DetailSheetProperties>
			</DetailSheetSection>

			<DetailSheetSection title={t(messages, "dealSheet.description")}>
				<InlineTextArea
					label={t(messages, "dealSheet.description")}
					value={deal.description}
					placeholder={tf(messages, "dealSheet.descriptionPlaceholder", {
						company: deal.company.name,
					})}
					saving={isSaving("description")}
					onSave={(description) => save({ description })}
				/>
			</DetailSheetSection>

			<WhereItStands deal={deal} />
		</DetailSheetBody>
	);
}

function WhereItStands({ deal }: { deal: Deal }) {
	const openRecord = useOpenRecord();
	const { messages } = useLocale();

	return (
		<DetailSheetSection title={t(messages, "dealSheet.whereItStands")}>
			<DetailSheetProperties>
				<DetailSheetProperty label={t(messages, "dealSheet.opened")}>
					<LocalDateTime date={deal.createdAt} options={DATE_OPTIONS} />
				</DetailSheetProperty>

				<DetailSheetProperty label={t(messages, "dealSheet.inStageSince")}>
					<LocalDateTime date={deal.stageChangedAt} options={DATE_OPTIONS} />
				</DetailSheetProperty>

				{deal.closedAt ? (
					<DetailSheetProperty label={t(messages, "dealSheet.closed")}>
						<LocalDateTime date={deal.closedAt} options={DATE_OPTIONS} />
					</DetailSheetProperty>
				) : null}

				{deal.closedReason ? (
					<DetailSheetProperty label={t(messages, "dealSheet.reason")} wide>
						{deal.closedReason}
					</DetailSheetProperty>
				) : null}

				<DetailSheetProperty label={t(messages, "dealSheet.onIt")} wide>
					{deal.contacts.length === 0 ? (
						<span className="text-muted-foreground">
							{tf(messages, "dealSheet.nobodyAttached", {
								company: deal.company.name,
							})}
						</span>
					) : (
						<span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
							{deal.contacts.map((contact) => {
								const aside = contact.role ?? contact.title;
								return (
									<button
										key={contact.id}
										type="button"
										onClick={() =>
											openRecord({ kind: "contact", id: contact.id })
										}
										className="min-w-0 truncate underline-offset-2 hover:underline"
									>
										{contactName(contact)}
										{aside ? (
											<span className="text-muted-foreground"> ({aside})</span>
										) : null}
									</button>
								);
							})}
						</span>
					)}
				</DetailSheetProperty>
			</DetailSheetProperties>
		</DetailSheetSection>
	);
}

function DealContacts({
	deal,
	adding,
	onAdd,
	onDone,
}: {
	deal: Deal;
	adding: boolean;
	onAdd: () => void;
	onDone: () => void;
}) {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const openRecord = useOpenRecord();
	const { messages } = useLocale();

	const detach = useMutation(
		trpc.deals.detachContact.mutationOptions({
			onSuccess: () => cache.deal(deal.id, { settle: "record" }),
			onError: () => toast.error(t(messages, "dealSheet.removeContactError")),
		}),
	);

	const setRole = useMutation(
		trpc.deals.setContactRole.mutationOptions({
			onSuccess: () => cache.deal(deal.id, { settle: "record" }),
			onError: () => toast.error(t(messages, "dealSheet.roleError")),
		}),
	);

	const form = adding ? (
		<AttachDealContact
			dealId={deal.id}
			companyName={deal.company.name}
			onDone={onDone}
		/>
	) : null;

	if (deal.contacts.length === 0) {
		return (
			<>
				{form}
				{adding ? null : (
					<DetailSheetEmpty
						icon={UserMultiple}
						title={t(messages, "dealSheet.noContactsTitle")}
						description={tf(messages, "dealSheet.noContactsDescription", {
							company: deal.company.name,
						})}
						action={
							<Button variant="outline" size="sm" onClick={onAdd}>
								<Icon icon={Add} data-icon="inline-start" />
								{t(messages, "dealSheet.addContact")}
							</Button>
						}
					/>
				)}
			</>
		);
	}

	return (
		<>
			{form}
			<SimpleTable variant="panel" columns={contactColumns(messages)}>
				{deal.contacts.map((contact) => (
					<SimpleTableRow
						key={contact.id}
						clickable
						onClick={() => openRecord({ kind: "contact", id: contact.id })}
					>
						<TableCell className="truncate py-2.5 pe-3 ps-5 font-medium">
							<span className="flex min-w-0 items-center gap-2">
								<PersonAvatar
									src={contact.imageUrl}
									name={contactName(contact)}
									email={contact.email}
									size="sm"
								/>
								<span className="truncate">{contactName(contact)}</span>
							</span>
						</TableCell>
						<TableCell className="truncate px-1 py-2.5">
							<InlineTextCell
								label={tf(messages, "dealSheet.contactRoleLabel", {
									name: contactName(contact),
								})}
								value={contact.role}
								placeholder={t(messages, "dealSheet.rolePlaceholder")}
								saving={
									setRole.isPending &&
									setRole.variables?.contactId === contact.id
								}
								onSave={(role) =>
									setRole.mutate({
										dealId: deal.id,
										contactId: contact.id,
										role: role || null,
									})
								}
							/>
						</TableCell>
						<TableCell className="truncate px-3 py-2.5 text-muted-foreground">
							{contact.title ?? <EmptyCellValue />}
						</TableCell>
						<TableCell className="truncate px-3 py-2.5 text-muted-foreground">
							{contact.email ?? <EmptyCellValue />}
						</TableCell>
						<TableCell className="px-3 py-2.5">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon-xs"
										disabled={detach.isPending}
										onClick={(event) => {
											event.stopPropagation();
											detach.mutate({
												dealId: deal.id,
												contactId: contact.id,
											});
										}}
									>
										<Icon icon={Close} />
										<span className="sr-only">
											{tf(messages, "dealSheet.removeContactLabel", {
												name: contactName(contact),
											})}
										</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{t(messages, "dealSheet.removeContact")}
								</TooltipContent>
							</Tooltip>
						</TableCell>
					</SimpleTableRow>
				))}

				<AddRow
					label={t(messages, "dealSheet.addContact")}
					columns={contactColumns(messages).length}
					onClick={onAdd}
				/>
			</SimpleTable>
		</>
	);
}
