"use client";

import Copy from "@carbon/icons-react/es/Copy";
import { Button } from "@crm/ui/components/button";
import { Icon } from "@crm/ui/components/icon";
import { toast } from "sonner";
import { tf, useLocale } from "@/components/locale-provider";

export function CopyValue({ value, label }: { value: string; label: string }) {
	const { messages } = useLocale();

	const unavailable = () =>
		toast.error(
			tf(messages, "settings.copy.unavailable", {
				label: label.toLowerCase(),
			}),
		);

	return (
		<Button
			variant="ghost"
			size="icon"
			type="button"
			onClick={() => {
				const clipboard = navigator.clipboard;

				if (!clipboard) {
					unavailable();
					return;
				}

				clipboard
					.writeText(value)
					.then(() =>
						toast.success(tf(messages, "settings.copy.copied", { label })),
					)
					.catch(unavailable);
			}}
		>
			<Icon icon={Copy} />
			<span className="sr-only">
				{tf(messages, "settings.copy.srOnly", { label: label.toLowerCase() })}
			</span>
		</Button>
	);
}
