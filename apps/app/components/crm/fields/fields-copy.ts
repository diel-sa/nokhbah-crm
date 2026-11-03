import type { RecordKind } from "@/components/crm/record-sheet/record-stack";
import { t, tf } from "@/components/locale-provider";
import type { Messages } from "@/lib/i18n/messages";
import type { FieldEntity } from "./fields-entity";

const STANDARD_FIELD_KEYS = {
	Name: "name",
	Domain: "domain",
	Website: "website",
	Phone: "phone",
	Email: "email",
	City: "city",
	Country: "country",
	Owner: "owner",
	"First name": "firstName",
	"Last name": "lastName",
	Title: "title",
	LinkedIn: "linkedin",
	GitHub: "github",
	Company: "company",
	Amount: "amount",
	Currency: "currency",
	"Close date": "closeDate",
	Stage: "stage",
} satisfies Record<string, string>;

const TEMPLATE_KEYS = {
	"Account type": "accountType",
	Segment: "segment",
	Territory: "territory",
	"Lifecycle stage": "lifecycleStage",
	"Lead source": "leadSource",
	"ICP fit score": "icpFitScore",
	"BDR owner": "bdrOwner",
} satisfies Record<string, string>;

export function fieldText(messages: Messages, key: string): string {
	return t(messages, `fields.${key}`);
}

export function fieldFormat(
	messages: Messages,
	key: string,
	values: Record<string, string | number>,
): string {
	return tf(messages, `fields.${key}`, values);
}

export function subtitleFor(messages: Messages, kind: RecordKind): string {
	return fieldText(messages, `subtitle.${kind}`);
}

export function optionLabel(messages: Messages, index: number): string {
	return fieldFormat(messages, "optionLabel", { index: index + 1 });
}

export function sheetPlacement(
	messages: Messages,
	entity: FieldEntity,
): string {
	return fieldText(messages, `showOnSheet.${entity}`);
}

export function tablePlacement(
	messages: Messages,
	entity: FieldEntity,
): string {
	return fieldText(messages, `offerAsColumn.${entity}`);
}

export function filterPlacement(
	messages: Messages,
	entity: FieldEntity,
): string {
	return fieldText(messages, `offerAsFilter.${entity}`);
}

function mappedKey<T extends Record<string, string>>(
	mapping: T,
	label: string,
): string | undefined {
	return Object.hasOwn(mapping, label) ? mapping[label as keyof T] : undefined;
}

export function standardFieldLabel(messages: Messages, label: string): string {
	const key = mappedKey(STANDARD_FIELD_KEYS, label);
	return key ? fieldText(messages, `standardField.${key}`) : label;
}

export function templateLabel(messages: Messages, label: string): string {
	const key = mappedKey(TEMPLATE_KEYS, label);
	return key ? fieldText(messages, `template.${key}`) : label;
}

export function typeName(messages: Messages, type: string): string {
	return fieldText(messages, `typeName.${type}`);
}

export function typeHint(messages: Messages, type: string): string {
	return fieldText(messages, `typeHints.${type}`);
}
