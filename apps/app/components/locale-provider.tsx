"use client";

import { createContext, useContext, useOptimistic } from "react";
import type { Locale } from "@/lib/i18n/locale";
import type { Messages } from "@/lib/i18n/messages";

type LocaleContextType = {
	locale: Locale;
	messages: Messages;
	setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
	locale: initialLocale,
	messages,
	children,
}: {
	locale: Locale;
	messages: Messages;
	children: React.ReactNode;
}) {
	const [locale, setLocaleOptimistic] = useOptimistic<Locale, Locale>(
		initialLocale,
		(_, next) => next,
	);

	return (
		<LocaleContext.Provider
			value={{
				locale,
				messages,
				setLocale: async (next) => {
					await fetch("/api/locale", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ locale: next }),
					});
					setLocaleOptimistic(next);
					window.location.reload();
				},
			}}
		>
			{children}
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
