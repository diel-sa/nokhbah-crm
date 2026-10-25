"use client";

import { UiStringsProvider } from "@crm/ui/components/ui-strings";
import { DirectionProvider } from "@radix-ui/react-direction";
import { createContext, useContext, useState } from "react";
import type { Locale } from "@/lib/i18n/locale";
import type { Messages } from "@/lib/i18n/messages";

type LocaleContextType = {
	locale: Locale;
	messages: Messages;
	setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

function readLocaleCookie(): Locale {
	if (!globalThis.document) return "en";
	const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
	return match?.[1] === "ar" ? "ar" : "en";
}

function applyHtmlDirection(locale: Locale) {
	document.documentElement.lang = locale;
	document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

export function LocaleProvider({
	messages,
	children,
}: {
	messages: { en: Messages; ar: Messages };
	children: React.ReactNode;
}) {
	const [locale, setLocaleState] = useState<Locale>(readLocaleCookie);

	const value: LocaleContextType = {
		locale,
		messages: messages[locale],
		setLocale: (next) => {
			document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
			applyHtmlDirection(next);
			setLocaleState(next);
		},
	};

	return (
		<LocaleContext.Provider value={value}>
			<DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
				<UiStringsProvider
					strings={{
						...value.messages.ui,
						...value.messages.common,
					}}
				>
					{children}
				</UiStringsProvider>
			</DirectionProvider>
		</LocaleContext.Provider>
	);
}

export function useLocale() {
	const ctx = useContext(LocaleContext);
	if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
	return ctx;
}

export function t(messages: Messages, path: string): string {
	const keys = path.split(".");
	// biome-ignore lint/suspicious/noExplicitAny: generic deep lookup on JSON structure
	let value: any = messages;
	for (const key of keys) {
		if (value == null) return path;
		value = value[key];
	}
	return String(value ?? path);
}

export function tf(
	messages: Messages,
	path: string,
	vars: Record<string, string | number>,
): string {
	let value = t(messages, path);
	for (const [key, replacement] of Object.entries(vars)) {
		value = value.replaceAll(`{${key}}`, String(replacement));
	}
	return value;
}
