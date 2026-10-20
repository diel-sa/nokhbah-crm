"use client";

import Launch from "@carbon/icons-react/es/Launch";
import Warning from "@carbon/icons-react/es/Warning";
import { authClient } from "@crm/auth/client";
import { SYNC_SCOPES } from "@crm/auth/scopes";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@crm/ui/components/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@crm/ui/components/alert-dialog";
import GoogleLogo from "@crm/ui/components/brand-logos/google";
import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Icon } from "@crm/ui/components/icon";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { Switch } from "@crm/ui/components/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { LocalRelativeTime } from "@/components/local-date-time";
import { t, tf, useLocale } from "@/components/locale-provider";
import { isSyncing, SYNC_POLL_MS } from "@/lib/sync-status";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

const SOURCES = {
	calendar: {
		labelKey: "settings.connections.googleCard.meetings",
		autoCreateKey: "settings.connections.googleCard.meetingsAutoCreate",
	},
	gmail: {
		labelKey: "settings.connections.googleCard.email",
		autoCreateKey: "settings.connections.autoCreateReply",
	},
} as const;

const RESOLVE_HOSTS = [
	"console.cloud.google.com",
	"console.developers.google.com",
	"support.google.com",
	"myaccount.google.com",
];

function resolveLink(error: string): string | undefined {
	const found = error.match(/https?:\/\/[^\s)]+/)?.[0];
	if (!found) return undefined;

	try {
		const url = new URL(found);
		const allowed =
			url.protocol === "https:" &&
			RESOLVE_HOSTS.some(
				(host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
			);
		return allowed ? url.toString() : undefined;
	} catch {
		return undefined;
	}
}

function explain(error: string) {
	return {
		summary: error.split(/(?<=\.)\s/)[0] ?? error,
		url: resolveLink(error),
	};
}

function failureSignature(
	sources: readonly {
		source: string;
		status: string | null;
		lastError: string | null;
	}[],
): string {
	const failures: string[] = [];
	for (const source of sources) {
		if (source.status === "NEEDS_RECONNECT" || source.lastError) {
			failures.push(`${source.source}:${source.lastError ?? "reconnect"}`);
		}
	}
	return failures.sort().join("|");
}

function GoogleUnavailable() {
	const { messages } = useLocale();

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						Google
						<StatusIndicator
							size="sm"
							tone="neutral"
							label={t(messages, "settings.connections.notConfigured")}
						/>
					</div>
				</CardTitle>
				<CardDescription>
					{t(
						messages,
						"settings.connections.googleCard.unavailableDescription",
					)}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}

const CONNECT_ERRORS = new Set(["email_doesn't_match"]);

function ConnectGoogle({
	slug,
	connectError,
}: {
	slug: string;
	connectError?: string;
}) {
	const { messages } = useLocale();
	const [pending, setPending] = useState(false);

	function fail(message?: string) {
		setPending(false);
		toast.error(
			message ?? t(messages, "settings.connections.googleCard.couldNotReach"),
		);
	}

	async function handleConnect() {
		setPending(true);

		const origin = window.location.origin;

		const { error } = await authClient.linkSocial({
			provider: "google",
			scopes: [...SYNC_SCOPES],
			callbackURL: `${origin}/${slug}/settings/connections/google`,
			errorCallbackURL: `${origin}/${slug}/settings/connections/google?provider=google`,
		});

		if (error) fail(error.message);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						Google
						<StatusIndicator
							size="sm"
							tone="neutral"
							label={t(messages, "settings.connections.notConnected")}
						/>
					</div>
				</CardTitle>
				<CardDescription>
					{t(messages, "settings.connections.googleCard.description")}
				</CardDescription>

				<CardAction>
					<Button
						size="sm"
						disabled={pending}
						onClick={() => {
							handleConnect().catch(() => fail());
						}}
						type="button"
					>
						{pending ? (
							<Spinner data-icon="inline-start" />
						) : (
							<GoogleLogo data-icon="inline-start" className="size-4" />
						)}
						{t(messages, "settings.connections.googleCard.connect")}
					</Button>
				</CardAction>
			</CardHeader>

			{connectError ? (
				<CardContent>
					<Alert variant="destructive">
						<Icon icon={Warning} />
						<AlertTitle>
							{t(messages, "settings.connections.googleCard.connectErrorTitle")}
						</AlertTitle>
						<AlertDescription>
							{CONNECT_ERRORS.has(connectError)
								? t(
										messages,
										"settings.connections.googleCard.connectErrorEmailMismatch",
									)
								: t(
										messages,
										"settings.connections.googleCard.connectErrorGeneric",
									)}
						</AlertDescription>
					</Alert>
				</CardContent>
			) : null}
		</Card>
	);
}

export function GoogleConnection({
	slug,
	connectError,
}: {
	slug: string;
	connectError?: string;
}) {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const queryClient = useQueryClient();

	const status = useQuery({
		...trpc.google.status.queryOptions(),
		refetchInterval: (query) =>
			query.state.data?.sources.some((source) => isSyncing(source.status))
				? SYNC_POLL_MS
				: false,
	});

	const purge = useMutation(
		trpc.google.purgeSyncedData.mutationOptions({
			onSuccess: async (result) => {
				await cache.google();
				toast.success(
					tf(messages, "settings.connections.googleCard.purgeToast", {
						count: result.purged,
					}),
				);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	const revoke = useMutation(
		trpc.google.revokeAccess.mutationOptions({
			onSuccess: () =>
				window.location.assign(
					status.data?.required ? "/" : `/${slug}/settings/connections`,
				),
			onError: (error) => toast.error(error.message),
		}),
	);

	const setAutoCreate = useMutation(
		trpc.google.setAutoCreate.mutationOptions({
			onSuccess: () => cache.google({ settle: "record" }),
			onError: (error) => toast.error(error.message),
		}),
	);

	const [insistence, setInsistence] = useState(0);

	const syncNow = useMutation(
		trpc.google.syncNow.mutationOptions({
			onSuccess: async () => {
				const before = failureSignature(status.data?.sources ?? []);
				await cache.google();

				const after = failureSignature(
					queryClient.getQueryData(trpc.google.status.queryKey())?.sources ??
						[],
				);

				if (after && after === before) setInsistence((count) => count + 1);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!status.data) return null;

	const { sources, hasRefreshToken, configured, linked, required } =
		status.data;

	if (!configured) return <GoogleUnavailable />;
	if (!linked) return <ConnectGoogle slug={slug} connectError={connectError} />;

	const failing = sources.filter(
		(source) => source.status === "NEEDS_RECONNECT" || source.lastError,
	);
	const lastSyncedAt = sources
		.map((source) => source.lastSyncedAt)
		.filter((at): at is string => at !== null)
		.sort()
		.at(-1);

	const healthy = failing.length === 0 && hasRefreshToken;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						Google
						<StatusIndicator
							size="sm"
							tone={healthy ? "success" : "warning"}
							label={
								healthy
									? t(messages, "settings.connections.connected")
									: t(messages, "settings.connections.needsAttention")
							}
						/>
					</div>
				</CardTitle>
				<CardDescription>
					{t(messages, "settings.connections.googleCard.syncDescription")}
				</CardDescription>

				<CardAction>
					<Button
						variant="contrast"
						size="sm"
						disabled={syncNow.isPending}
						onClick={() => syncNow.mutate()}
					>
						{syncNow.isPending
							? t(messages, "settings.connections.googleCard.checking")
							: t(messages, "settings.connections.googleCard.checkNow")}
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				{!hasRefreshToken ? (
					<Alert variant="destructive" attention={insistence}>
						<Icon icon={Warning} />
						<AlertTitle>
							{t(
								messages,
								"settings.connections.googleCard.noRefreshTokenTitle",
							)}
						</AlertTitle>
						<AlertDescription>
							{t(
								messages,
								"settings.connections.googleCard.noRefreshTokenDetail",
							)}
						</AlertDescription>
					</Alert>
				) : failing.length > 0 ? (
					failing.map((source) => {
						const { summary, url } = explain(source.lastError ?? "");

						return (
							<Alert
								key={source.source}
								variant="destructive"
								attention={insistence}
							>
								<Icon icon={Warning} />
								<AlertTitle>
									{tf(messages, "settings.connections.googleCard.syncFailed", {
										source: t(messages, SOURCES[source.source].labelKey),
									})}
								</AlertTitle>
								<AlertDescription>{summary}</AlertDescription>

								{url ? (
									<AlertAction>
										<Button variant="contrast" size="xs" asChild>
											<a href={url} target="_blank" rel="noreferrer">
												{t(messages, "settings.connections.googleCard.resolve")}
												<Icon icon={Launch} data-icon="inline-end" />
											</a>
										</Button>
									</AlertAction>
								) : null}
							</Alert>
						);
					})
				) : (
					<p className="text-muted-foreground text-xs">
						{lastSyncedAt ? (
							<>
								{t(messages, "settings.connections.googleCard.lastChecked")}{" "}
								<LocalRelativeTime date={lastSyncedAt} />
							</>
						) : (
							t(messages, "settings.connections.googleCard.waitingFirst")
						)}
					</p>
				)}

				{sources.map((source) => {
					const copy = SOURCES[source.source];

					return (
						<div
							key={source.source}
							className="flex items-center justify-between gap-6"
						>
							<Label
								htmlFor={`auto-create-${source.source}`}
								className="flex flex-col items-start gap-1"
							>
								<span className="text-sm">{t(messages, copy.labelKey)}</span>
								<span className="font-normal text-muted-foreground text-xs">
									{t(messages, copy.autoCreateKey)}
								</span>
							</Label>

							<Switch
								id={`auto-create-${source.source}`}
								checked={source.autoCreate}
								disabled={setAutoCreate.isPending}
								onCheckedChange={(enabled) =>
									setAutoCreate.mutate({ source: source.source, enabled })
								}
							/>
						</div>
					);
				})}

				<CardFooter>
					<div className="-ml-2 flex flex-wrap items-center gap-1 text-muted-foreground">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="ghost" size="xs" disabled={purge.isPending}>
									{t(
										messages,
										"settings.connections.googleCard.deleteSyncedData",
									)}
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										{t(messages, "settings.connections.googleCard.deleteTitle")}
									</AlertDialogTitle>
									<AlertDialogDescription>
										{t(
											messages,
											"settings.connections.googleCard.deleteDescription",
										)}
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										onClick={() => purge.mutate()}
									>
										{t(messages, "settings.connections.googleCard.delete")}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="ghost" size="xs" disabled={revoke.isPending}>
									{t(messages, "settings.connections.googleCard.revokeAccess")}
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										{t(messages, "settings.connections.googleCard.revokeTitle")}
									</AlertDialogTitle>
									<AlertDialogDescription>
										{required
											? t(
													messages,
													"settings.connections.googleCard.revokeRequired",
												)
											: t(
													messages,
													"settings.connections.googleCard.revokeOptional",
												)}
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										onClick={() => revoke.mutate()}
									>
										{t(messages, "settings.connections.googleCard.revoke")}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<Button variant="ghost" size="xs" asChild>
							<Link
								href="https://myaccount.google.com/permissions"
								target="_blank"
								rel="noreferrer"
							>
								{t(messages, "settings.connections.googleCard.manageInAccount")}
							</Link>
						</Button>
					</div>
				</CardFooter>
			</CardContent>
		</Card>
	);
}
