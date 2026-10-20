"use client";

import { CONTEXT_DEV_SIGNUP_URL } from "@crm/db/settings";
import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@crm/ui/components/field";
import { Input } from "@crm/ui/components/input";
import { Spinner } from "@crm/ui/components/spinner";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { t, useLocale } from "@/components/locale-provider";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function ResearchKey() {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();

	const keyId = useId();
	const [draft, setDraft] = useState("");

	const key = useQuery(trpc.settings.researchKey.queryOptions());

	const save = useMutation(
		trpc.settings.setResearchKey.mutationOptions({
			onSuccess: async () => {
				await cache.settings();
				setDraft("");
				toast.success(t(messages, "settings.research.savedToast"));
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!key.data) return null;

	const { configured, hint } = key.data;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t(messages, "settings.research.title")}</CardTitle>
				<CardDescription>
					{t(messages, "settings.research.description")}
				</CardDescription>

				<CardAction>
					<Button
						type="submit"
						form="research-key"
						disabled={save.isPending || draft.trim() === ""}
					>
						{save.isPending ? <Spinner data-icon="inline-start" /> : null}
						{configured
							? t(messages, "settings.research.replaceKey")
							: t(messages, "settings.research.saveKey")}
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<form
					id="research-key"
					onSubmit={(event) => {
						event.preventDefault();
						save.mutate({ apiKey: draft.trim() });
					}}
				>
					<FieldGroup>
						<Field>
							<div className="flex items-center justify-between gap-3">
								<FieldLabel htmlFor={keyId}>
									{t(messages, "settings.research.keyLabel")}
								</FieldLabel>
								<StatusIndicator
									size="sm"
									tone={configured ? "success" : "warning"}
									label={
										configured
											? t(messages, "settings.research.connected")
											: t(messages, "settings.research.notConnected")
									}
								/>
							</div>
							<Input
								id={keyId}
								type="password"
								value={draft}
								onChange={(event) => setDraft(event.target.value)}
								placeholder={
									hint ?? t(messages, "settings.research.pastePlaceholder")
								}
								autoComplete="off"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck={false}
								disabled={save.isPending}
							/>
							<FieldDescription>
								{t(messages, "settings.research.noKeyYet")}{" "}
								<a
									href={CONTEXT_DEV_SIGNUP_URL}
									target="_blank"
									rel="noreferrer"
									className="underline underline-offset-4 hover:text-foreground"
								>
									{t(messages, "settings.research.signUpHere")}
								</a>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
