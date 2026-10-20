import { Button } from "@crm/ui/components/button";
import Link from "next/link";
import { Suspense } from "react";
import { LocalizedText } from "@/components/localized-text";
import { requireSession } from "@/lib/session";
import { ConnectionPage, ConnectionPageLoading } from "../connection-page";

export default function IntakeConnectionPage(
	props: PageProps<"/[slug]/settings/connections/intake">,
) {
	return (
		<Suspense fallback={<ConnectionPageLoading />}>
			<IntakeConnectionPageContent {...props} />
		</Suspense>
	);
}

async function IntakeConnectionPageContent({
	params,
}: PageProps<"/[slug]/settings/connections/intake">) {
	await requireSession();
	const { slug } = await params;

	return (
		<ConnectionPage centered className="max-w-(--container-narrow) text-center">
			<header className="flex flex-col gap-3 px-(--spacing-block-inline)">
				<h1 className="font-medium text-2xl tracking-tight">
					<LocalizedText k="settings.connections.intake.title" />
				</h1>
				<p className="text-muted-foreground text-sm leading-relaxed">
					<LocalizedText k="settings.connections.intake.description" />
				</p>
			</header>
			<div>
				<Button asChild variant="outline">
					<Link href={`/${slug}/settings/connections`}>
						<LocalizedText k="settings.connections.intake.back" />
					</Link>
				</Button>
			</div>
		</ConnectionPage>
	);
}
