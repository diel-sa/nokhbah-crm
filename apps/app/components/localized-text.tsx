"use client";

import { t, useLocale } from "@/components/locale-provider";

export function LocalizedText({ k }: { k: string }) {
	const { messages } = useLocale();
	return <>{t(messages, k)}</>;
}
