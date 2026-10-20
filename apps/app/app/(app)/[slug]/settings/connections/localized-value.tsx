"use client";

import { t, tf, useLocale } from "@/components/locale-provider";

export function LocalizedValue({
	k,
	values,
}: {
	k: string;
	values?: Record<string, string | number>;
}) {
	const { messages } = useLocale();
	return <>{values ? tf(messages, k, values) : t(messages, k)}</>;
}
