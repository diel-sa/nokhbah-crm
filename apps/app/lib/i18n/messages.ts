import "server-only";

import type { Locale } from "@/lib/i18n/locale";
import enMessages from "@/messages/en.json";

export type Messages = typeof enMessages;

const dictionaries = {
	en: async () => enMessages,
	ar: () => import("@/messages/ar.json").then((m) => m.default as Messages),
} satisfies Record<Locale, () => Promise<Messages>>;

export const getMessages = async (locale: Locale): Promise<Messages> =>
	dictionaries[locale]();
