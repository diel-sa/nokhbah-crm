import type { DealStage } from "@crm/db/enums";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { useLocale } from "@/components/locale-provider";
import { dealStageLabel, dealStagePresentation } from "@/lib/deal-stage";

export function DealStageIndicator({
	stage,
	className,
}: {
	stage: DealStage;
	className?: string;
}) {
	const { messages } = useLocale();
	const label = dealStageLabel(stage, messages);
	const { tone } = dealStagePresentation(stage);
	return <StatusIndicator tone={tone} label={label} className={className} />;
}
