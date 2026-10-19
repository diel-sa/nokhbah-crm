"use client";

import { signIn } from "@crm/auth/client";
import type { MailboxProviderId } from "@crm/auth/scopes";
import GoogleLogo from "@crm/ui/components/brand-logos/google";
import MicrosoftLogo from "@crm/ui/components/brand-logos/microsoft";
import { Button } from "@crm/ui/components/button";
import { Spinner } from "@crm/ui/components/spinner";
import type { FC, SVGProps } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { t, useLocale } from "@/components/locale-provider";

type ProviderChoice = {
	labelKey: string;
	Logo: FC<SVGProps<SVGSVGElement>>;
};

const PROVIDERS = {
	google: { labelKey: "auth.signInWithGoogle", Logo: GoogleLogo },
	microsoft: { labelKey: "auth.signInWithMicrosoft", Logo: MicrosoftLogo },
} as const satisfies Record<MailboxProviderId, ProviderChoice>;

export function SocialSignIn({ provider }: { provider: MailboxProviderId }) {
	const [pending, setPending] = useState(false);
	const { messages } = useLocale();

	const { labelKey, Logo } = PROVIDERS[provider];

	function fail(message?: string) {
		setPending(false);
		toast.error(message ?? "Could not reach the sign-in service.");
	}

	async function handleClick() {
		setPending(true);

		const origin = window.location.origin;

		const { error } = await signIn.social({
			provider,
			callbackURL: `${origin}/`,
			errorCallbackURL: `${origin}/sign-in`,
		});

		if (error) fail(error.message);
	}

	return (
		<Button
			className="w-full"
			disabled={pending}
			onClick={() => {
				handleClick().catch(() => fail());
			}}
			type="button"
			variant="outline"
		>
			{pending ? (
				<Spinner data-icon="inline-start" />
			) : (
				<Logo data-icon="inline-start" className="size-4" />
			)}
			{t(messages, labelKey)}
		</Button>
	);
}
