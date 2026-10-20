"use client";

import { t, useLocale } from "@/components/locale-provider";
import { useQueryState } from "nuqs";
import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { overviewParsers } from "./overview-search-params";

export function OverviewGreetingFallback() {
	const { messages } = useLocale();
	return (
		<>
			<PageShellTitle>{t(messages, "overview.welcomeBack")}</PageShellTitle>
			<PageShellDescription>
				{t(messages, "overview.descMe")}
			</PageShellDescription>
		</>
	);
}

export function OverviewGreeting() {
	const { messages } = useLocale();
	const [scope] = useQueryState(
		SEARCH_PARAM.overview.scope,
		overviewParsers[SEARCH_PARAM.overview.scope],
	);

	return (
		<>
			<PageShellTitle>{t(messages, "overview.welcomeBack")}</PageShellTitle>
			<PageShellDescription>
				{scope === "me"
					? t(messages, "overview.descMe")
					: t(messages, "overview.descTeam")}
			</PageShellDescription>
		</>
	);
}
