"use client";

import CheckmarkFilled from "@carbon/icons-react/es/CheckmarkFilled";
import Warning from "@carbon/icons-react/es/Warning";
import { Alert, AlertDescription, AlertTitle } from "@crm/ui/components/alert";
import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@crm/ui/components/field";
import { Icon } from "@crm/ui/components/icon";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@crm/ui/components/input-group";
import { Spinner } from "@crm/ui/components/spinner";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { t, tf, useLocale } from "@/components/locale-provider";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";

type Result = RouterOutputs["tracking"]["verify"];

export function VerifyInstallation() {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const urlId = useId();

	const [url, setUrl] = useState("");
	const [result, setResult] = useState<Result | null>(null);

	const tracking = useQuery(trpc.tracking.settings.queryOptions());

	const verify = useMutation(
		trpc.tracking.verify.mutationOptions({
			onSuccess: (outcome) => setResult(outcome),
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!tracking.data) return null;

	const { canManage, siteId } = tracking.data;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						{t(messages, "settings.tracking.verify.title")}
						{result ? <Indicator result={result} /> : null}
					</div>
				</CardTitle>
				<CardDescription>
					{t(messages, "settings.tracking.verify.description")}
				</CardDescription>

				<CardAction>
					<Button
						size="sm"
						type="submit"
						form="verify-tracking"
						disabled={!canManage || verify.isPending || url.trim() === ""}
					>
						{verify.isPending ? <Spinner data-icon="inline-start" /> : null}
						{t(messages, "settings.tracking.verify.checkNow")}
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<form
					id="verify-tracking"
					onSubmit={(event) => {
						event.preventDefault();
						setResult(null);
						verify.mutate({ url: url.trim() });
					}}
				>
					<Field>
						<FieldLabel htmlFor={urlId}>
							{t(messages, "settings.tracking.verify.pageLabel")}
						</FieldLabel>
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>https://</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								id={urlId}
								value={url}
								onChange={(event) => {
									setUrl(event.target.value);
									setResult(null);
								}}
								placeholder="acme.com/pricing"
								autoComplete="off"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck={false}
								inputMode="url"
								disabled={!canManage || verify.isPending}
							/>
						</InputGroup>
						<FieldDescription>
							{t(messages, "settings.tracking.verify.pageHint")}
						</FieldDescription>
					</Field>
				</form>

				{result && siteId ? <Outcome result={result} siteId={siteId} /> : null}
			</CardContent>
		</Card>
	);
}

function Indicator({ result }: { result: Result }) {
	const { messages } = useLocale();

	if (result.status === "found" && result.pageView) {
		return (
			<StatusIndicator
				size="sm"
				tone="success"
				label={t(messages, "settings.tracking.verify.statusVerified")}
			/>
		);
	}

	if (result.status === "found" && result.container?.carriesSiteId === false) {
		return (
			<StatusIndicator
				size="sm"
				tone="warning"
				label={t(messages, "settings.tracking.verify.statusGtmFix")}
			/>
		);
	}

	return (
		<StatusIndicator
			size="sm"
			tone="warning"
			label={
				result.status === "found"
					? t(messages, "settings.tracking.verify.statusNoPageView")
					: t(messages, "settings.tracking.verify.statusNotDetected")
			}
		/>
	);
}

function Outcome({ result, siteId }: { result: Result; siteId: string }) {
	const { messages } = useLocale();

	if (result.status === "unreachable") {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>
					{tf(messages, "settings.tracking.verify.unreachableTitle", {
						host: result.host,
					})}
				</AlertTitle>
				<AlertDescription>
					{result.detail}{" "}
					{t(messages, "settings.tracking.verify.unreachableDetail")}
				</AlertDescription>
			</Alert>
		);
	}

	if (result.status === "missing") {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>
					{tf(messages, "settings.tracking.verify.missingTitle", {
						host: result.host,
					})}
				</AlertTitle>
				<AlertDescription>
					{tf(messages, "settings.tracking.verify.missingDetail", {
						ms: result.responseMs,
					})}
					{result.containers.length > 0
						? ` ${tf(messages, "settings.tracking.verify.containersNote", {
								containers: result.containers.join(" + "),
							})}`
						: ""}
				</AlertDescription>
			</Alert>
		);
	}

	if (result.container && !result.container.carriesSiteId) {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>
					{t(messages, "settings.tracking.verify.gtmDropTitle")}
				</AlertTitle>
				<AlertDescription>
					{tf(messages, "settings.tracking.verify.gtmDropDetail", {
						container: result.container.id,
					})}
					{result.pageView
						? ` ${t(messages, "settings.tracking.verify.gtmDropPageView")}`
						: ""}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Alert>
			<Icon icon={CheckmarkFilled} className="text-success" />
			<AlertTitle>
				{result.container
					? tf(messages, "settings.tracking.verify.successTitleContainer", {
							container: result.container.id,
						})
					: tf(messages, "settings.tracking.verify.successTitleHost", {
							host: result.host,
						})}
			</AlertTitle>
			<AlertDescription>
				{tf(messages, "settings.tracking.verify.successDetail", {
					ms: result.responseMs,
					siteId,
					state: result.allowed
						? t(messages, "settings.tracking.verify.onList")
						: t(messages, "settings.tracking.verify.notOnList"),
				})}
				{result.container
					? ` ${t(messages, "settings.tracking.verify.successGtmNote")}`
					: ""}
				{result.pageView
					? ` ${t(messages, "settings.tracking.verify.successPageView")}`
					: ` ${t(messages, "settings.tracking.verify.noPageViewYet")}`}
			</AlertDescription>
		</Alert>
	);
}
