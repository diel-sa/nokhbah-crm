import type { Messages } from "@/lib/i18n/messages";

export function formatCountL(
	messages: Messages,
	count: number,
	noun: "deal" | "contact" | "company" | "record",
): string {
	const section = (
		messages.common?.counts as
			| Record<string, { one: string; other: string }>
			| undefined
	)?.[noun];
	const label = count === 1 ? section?.one : section?.other;
	return `${count} ${label ?? noun}`;
}
