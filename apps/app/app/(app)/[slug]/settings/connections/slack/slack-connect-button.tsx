"use client";

import { authClient } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { useState } from "react";
import { toast } from "sonner";
import { t, tf, useLocale } from "@/components/locale-provider";

const CONNECT_ERRORS = new Set([
	"access_denied",
	"account_already_linked_to_different_user",
	"email_doesn't_match",
	"oauth_code_verification_failed",
	"user_info_is_missing",
]);

function errorKey(connectError: string): string {
	switch (connectError) {
		case "access_denied":
			return "settings.connections.connectButton.errAccessDenied";
		case "account_already_linked_to_different_user":
			return "settings.connections.connectButton.errAlreadyLinked";
		case "email_doesn't_match":
			return "settings.connections.connectButton.errEmailMismatch";
		case "oauth_code_verification_failed":
			return "settings.connections.connectButton.errOauthFailed";
		case "user_info_is_missing":
			return "settings.connections.connectButton.errProfileMissing";
		default:
			return "settings.connections.connectButton.genericError";
	}
}

async function startSlackOAuth(slug: string, fallback: string) {
	try {
		const { error } = await authClient.oauth2.link({
			providerId: "slack",
			callbackURL: `${window.location.origin}/${slug}/settings/connections/slack/people`,
			errorCallbackURL: `${window.location.origin}/${slug}/settings/connections/slack?provider=slack`,
		});
		if (error) toast.error(error.message || fallback);
	} catch (error) {
		toast.error(error instanceof Error ? error.message : fallback);
	}
}

export function SlackReconnectButton({ slug }: { slug: string }) {
	const [pending, setPending] = useState(false);
	const { messages } = useLocale();

	return (
		<Button
			disabled={pending}
			onClick={async () => {
				setPending(true);
				await startSlackOAuth(
					slug,
					t(messages, "settings.connections.connectButton.couldNotConnect"),
				);
				setPending(false);
			}}
			size="xs"
			variant="contrast"
		>
			{pending
				? t(messages, "settings.connections.connectButton.opening")
				: t(messages, "settings.connections.connectButton.reconnect")}
		</Button>
	);
}

export function SlackConnectButton({
	slug,
	configured,
	connectError,
}: {
	slug: string;
	configured: boolean;
	connectError?: string;
}) {
	const [pending, setPending] = useState(false);
	const { messages } = useLocale();
	const connect = async () => {
		setPending(true);
		await startSlackOAuth(
			slug,
			t(messages, "settings.connections.connectButton.couldNotConnect"),
		);
		setPending(false);
	};
	return (
		<div className="flex min-w-0 flex-col gap-2">
			<Button onClick={() => void connect()} disabled={!configured || pending}>
				{pending
					? t(messages, "settings.connections.connectButton.opening")
					: configured
						? t(messages, "settings.connections.connectButton.connect")
						: t(messages, "settings.connections.connectButton.notConfigured")}
			</Button>
			{connectError ? (
				<p role="alert" className="max-w-sm text-destructive text-xs">
					{CONNECT_ERRORS.has(connectError)
						? t(messages, errorKey(connectError))
						: tf(messages, "settings.connections.connectButton.genericError", {
								code: connectError.replaceAll("_", " "),
							})}
				</p>
			) : null}
		</div>
	);
}
