import { currencyName } from "@crm/db/currency";
import type { Messages } from "@/lib/i18n/messages";

export function localizedCurrencyName(
	code: string,
	messages: Messages,
): string {
	const section = messages.currencyNames as Record<string, string> | undefined;
	return section?.[code] ?? currencyName(code) ?? code;
}
