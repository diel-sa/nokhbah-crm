import type { Metadata } from "next";
import { Suspense } from "react";
import { LocalizedText } from "@/components/localized-text";
import {
	PageShell,
	PageShellContent,
	PageShellDescription,
	PageShellHeader,
	PageShellHeading,
	PageShellLoading,
	PageShellTitle,
} from "@/components/page-shell";
import { requireSession } from "@/lib/session";
import { HydrateClient } from "@/lib/trpc/hydrate";
import { getServerQueryClient, getServerTrpc } from "@/lib/trpc/server";
import { CurrencySettings } from "./currency-settings";

export const metadata: Metadata = {
	title: "Currencies",
};

export default function CurrenciesSettingsPage() {
	return (
		<PageShell>
			<PageShellHeader>
				<PageShellHeading>
					<PageShellTitle>
						<LocalizedText k="settings.pages.currencies" />
					</PageShellTitle>
					<PageShellDescription>
						<LocalizedText k="settings.pages.currenciesDescription" />
					</PageShellDescription>
				</PageShellHeading>
			</PageShellHeader>

			<PageShellContent>
				<Suspense fallback={<PageShellLoading />}>
					<Currencies />
				</Suspense>
			</PageShellContent>
		</PageShell>
	);
}

async function Currencies() {
	await requireSession();

	const trpc = getServerTrpc();
	const queryClient = getServerQueryClient();

	await queryClient.prefetchQuery(trpc.currency.settings.queryOptions());

	return (
		<HydrateClient>
			<div className="flex max-w-3xl flex-col gap-6">
				<CurrencySettings />
			</div>
		</HydrateClient>
	);
}
