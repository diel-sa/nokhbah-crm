import ArrowRight from "@carbon/icons-react/es/ArrowRight";
import Chat from "@carbon/icons-react/es/Chat";
import Email from "@carbon/icons-react/es/Email";
import Events from "@carbon/icons-react/es/Events";
import MagicWand from "@carbon/icons-react/es/MagicWand";
import Phone from "@carbon/icons-react/es/Phone";
import Task from "@carbon/icons-react/es/Task";
import type { ActivityType } from "@crm/db/enums";
import type { CarbonIcon } from "@crm/ui/components/icon";
import type { Messages } from "@/lib/i18n/messages";

type ActivityPresentation = Record<
	ActivityType,
	{ icon: CarbonIcon; label: string }
>;

const PRESENTATION: ActivityPresentation = {
	NOTE: { icon: Chat, label: "Note" },
	CALL: { icon: Phone, label: "Call" },
	EMAIL: { icon: Email, label: "Email" },
	MEETING: { icon: Events, label: "Meeting" },
	TASK: { icon: Task, label: "Task" },
	STAGE_CHANGE: { icon: ArrowRight, label: "Stage change" },
	ENRICHMENT: { icon: MagicWand, label: "Enrichment" },
};

export function activityLabel(type: ActivityType, messages?: Messages): string {
	const localized = messages?.activities[type];
	return localized ?? PRESENTATION[type].label;
}

const SUBJECT_KEYS = {
	"Stage changed": "stageChanged",
	"Company added from your inbox": "companyFromInbox",
	"Contact added from your inbox": "contactFromInbox",
} satisfies Record<string, keyof Messages["activitySubjects"]>;

export function activitySubjectLabel(
	subject: string | null | undefined,
	type: ActivityType,
	messages?: Messages,
): string {
	const key = subject
		? SUBJECT_KEYS[subject as keyof typeof SUBJECT_KEYS]
		: undefined;
	if (messages && key) return messages.activitySubjects[key];
	if (subject) return subject;
	return activityLabel(type, messages);
}

export function activityIcon(type: ActivityType): CarbonIcon {
	return PRESENTATION[type].icon;
}
