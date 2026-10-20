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
import { AgentModel } from "./agent-model";
import { ArchiveRetention } from "./archive-retention";
import { LanguageSwitcher } from "./language-switcher";
import { ResearchKey } from "./research-key";
import { WorkspaceForm } from "./workspace-form";

export const metadata: Metadata = {
	title: "General",
};

export default function GeneralSettingsPage() {
	return (
		<PageShell>
			<PageShellHeader>
				<PageShellHeading>
					<PageShellTitle>
						<LocalizedText k="settings.pages.general" />
					</PageShellTitle>
					<PageShellDescription>
						<LocalizedText k="settings.pages.generalDescription" />
					</PageShellDescription>
				</PageShellHeading>
			</PageShellHeader>

			<PageShellContent>
				<Suspense fallback={<PageShellLoading />}>
					<Settings />
				</Suspense>
			</PageShellContent>
		</PageShell>
	);
}

async function Settings() {
	await requireSession();

	const trpc = getServerTrpc();
	const queryClient = getServerQueryClient();

	await Promise.all([
		queryClient.prefetchQuery(trpc.workspace.get.queryOptions()),
		queryClient.prefetchQuery(trpc.settings.agentModel.queryOptions()),
		queryClient.prefetchQuery(trpc.settings.modelCatalog.queryOptions()),
		queryClient.prefetchQuery(trpc.settings.researchKey.queryOptions()),
		queryClient.prefetchQuery(trpc.settings.archiveRetention.queryOptions()),
	]);

	return (
		<HydrateClient>
			<div className="flex max-w-3xl flex-col gap-6">
				<WorkspaceForm />
				<LanguageSwitcher />
				<ResearchKey />
				<ArchiveRetention />
				<AgentModel />
			</div>
		</HydrateClient>
	);
}
