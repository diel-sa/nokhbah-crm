import type { EnrichmentStatus } from "@crm/db/enums";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { t, useLocale } from "@/components/locale-provider";
import { enrichmentPresentation } from "@/lib/enrichment-status";

export function EnrichmentIndicator({
	status,
	queued = false,
	title,
	className,
}: {
	status: EnrichmentStatus;
	queued?: boolean;
	title?: string | null;
	className?: string;
}) {
	const { messages } = useLocale();
	const { label, tone, busy } = enrichmentPresentation(status, queued);
	const localized =
		status === "PENDING" && queued
			? t(messages, "enrichment.QUEUED")
			: t(messages, `enrichment.${status}`);

	return (
		<StatusIndicator
			tone={tone}
			busy={busy}
			label={localized === `enrichment.${status}` ? label : localized}
			title={title ?? undefined}
			className={className}
		/>
	);
}
