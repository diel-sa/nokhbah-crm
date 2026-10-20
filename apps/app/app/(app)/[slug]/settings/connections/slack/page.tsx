import Close from "@carbon/icons-react/es/Close";
import Warning from "@carbon/icons-react/es/Warning";
import {
	describeSlackScopes,
	SLACK_REQUESTED_SCOPES,
	SLACK_SCOPE_GROUPS,
	SLACK_USER_GRANT,
	type SlackScope,
	slackScopeDrift,
} from "@crm/auth";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@crm/ui/components/alert";
import SlackLogo from "@crm/ui/components/brand-logos/slack";
import { Button } from "@crm/ui/components/button";
import { Icon } from "@crm/ui/components/icon";
import Link from "next/link";
import { Suspense } from "react";
import { NewAgentDialog } from "@/components/agent-builder/new-agent-dialog";
import { LocalizedText } from "@/components/localized-text";
import { requireSession } from "@/lib/session";
import { getServerQueryClient, getServerTrpc } from "@/lib/trpc/server";
import { ConnectionPage, ConnectionPageLoading } from "../connection-page";
import { LocalizedValue } from "../localized-value";
import { type ConnectionQuery, connectErrorOf } from "../oauth-connection-page";
import { SlackChannels } from "./slack-channels";
import {
	SlackConnectButton,
	SlackReconnectButton,
} from "./slack-connect-button";
import { SlackDisconnectButton } from "./slack-disconnect-button";
import { SlackScopeGroups } from "./slack-scope-groups";

const PRIVATE_CHANNEL_SCOPES = [
	"groups:read",
	"groups:history",
	SLACK_USER_GRANT.scope,
];

const neverKeys = [
	"settings.connections.slackPage.never1",
	"settings.connections.slackPage.never2",
	"settings.connections.slackPage.never3",
];

const suggestionKeys: [string, string][] = [
	[
		"settings.connections.slackPage.sug1Name",
		"settings.connections.slackPage.sug1Description",
	],
	[
		"settings.connections.slackPage.sug2Name",
		"settings.connections.slackPage.sug2Description",
	],
	[
		"settings.connections.slackPage.sug3Name",
		"settings.connections.slackPage.sug3Description",
	],
];

type SlackConnectionPageProps = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<ConnectionQuery>;
};

export default function SlackConnectionPage(props: SlackConnectionPageProps) {
	return (
		<Suspense fallback={<ConnectionPageLoading />}>
			<SlackConnectionPageContent {...props} />
		</Suspense>
	);
}

async function SlackConnectionPageContent({
	params,
	searchParams,
}: SlackConnectionPageProps) {
	await requireSession();
	const [{ slug }, query] = await Promise.all([params, searchParams]);
	const queryClient = getServerQueryClient();
	const status = await queryClient.fetchQuery(
		getServerTrpc().slack.status.queryOptions(),
	);
	return status.connected ? (
		<ConnectedSlack slug={slug} status={status} />
	) : (
		<ConnectionPage centered className="max-w-(--container-page)">
			<header className="flex flex-col gap-3 px-(--spacing-block-inline)">
				<div className="flex items-center gap-3">
					<SlackLogo className="size-6" />
					<h1 className="font-medium text-xl">Slack</h1>
					<span className="ml-auto text-muted-foreground text-sm">
						<LocalizedText k="settings.connections.notConnected" />
					</span>
				</div>
				<p className="text-muted-foreground text-sm leading-relaxed">
					<LocalizedText k="settings.connections.slackPage.connectIntro" />
				</p>
			</header>
			<SlackScopeGroups
				groups={groupScopes([...SLACK_REQUESTED_SCOPES])}
				title={<LocalizedText k="settings.connections.slackPage.handingOver" />}
				withheld={[]}
			/>
			<PlainList
				title={<LocalizedText k="settings.connections.slackPage.neverTitle" />}
				items={neverKeys.map((k) => <LocalizedText key={k} k={k} />)}
				icon={Close}
				tone="text-muted-foreground"
			/>
			<div className="flex items-center gap-4 border-y px-(--spacing-block-inline) py-5">
				<SlackConnectButton
					slug={slug}
					configured={status.configured}
					connectError={connectErrorOf(query, "slack")}
				/>
				<p className="text-muted-foreground text-xs">
					<LocalizedText k="settings.connections.slackPage.approveNote" />
				</p>
			</div>
			<section className="flex flex-col gap-3 px-(--spacing-block-inline)">
				<div>
					<h2 className="font-medium text-sm">
						<LocalizedText k="settings.connections.slackPage.suggestionsTitle" />
					</h2>
					<p className="text-muted-foreground text-xs">
						<LocalizedText k="settings.connections.slackPage.suggestionsNote" />
					</p>
				</div>
				<div className="grid gap-3 md:grid-cols-3">
					{suggestionKeys.map(([nameKey, descriptionKey]) => (
						<div className="rounded-lg border p-4" key={nameKey}>
							<h3 className="font-medium text-sm">
								<LocalizedText k={nameKey} />
							</h3>
							<p className="mt-2 text-muted-foreground text-xs leading-relaxed">
								<LocalizedText k={descriptionKey} />
							</p>
						</div>
					))}
				</div>
			</section>
		</ConnectionPage>
	);
}

function toLine(entry: SlackScope) {
	return {
		scope: entry.scope,
		grant: entry.grant,
		sensitive: entry.sensitive,
	};
}

function groupScopes(scopes: string[]) {
	const held = describeSlackScopes(scopes);

	return SLACK_SCOPE_GROUPS.map((group) => ({
		id: group.id,
		label: group.label,
		summary: group.summary,
		scopes: held.filter((entry) => entry.group === group.id).map(toLine),
	})).filter((group) => group.scopes.length > 0);
}

function ConnectedSlack({
	slug,
	status,
}: {
	slug: string;
	status: {
		workspace: string | null;
		agents: Array<{
			id: string;
			name: string;
			description: string | null;
			status: string;
		}>;
		scopes: string[];
		canInviteItself: boolean;
		canManage: boolean;
		people: { matched: number; reviewed: number };
	};
}) {
	const agents = status.agents;
	const drift = slackScopeDrift(status.scopes);
	const missing = status.canInviteItself
		? drift.missing
		: [...drift.missing, SLACK_USER_GRANT];
	return (
		<ConnectionPage>
			<header className="flex flex-col gap-2 px-(--spacing-block-inline)">
				<div className="flex items-center gap-3">
					<SlackLogo className="size-6" />
					<h1 className="font-medium text-xl">Slack</h1>
					<span className="ml-auto text-muted-foreground text-sm">
						{status.workspace ?? (
							<LocalizedText k="settings.connections.connected" />
						)}
					</span>
					<SlackDisconnectButton
						canManage={status.canManage}
						workspace={status.workspace}
					/>
				</div>
				<p className="text-muted-foreground text-sm">
					<LocalizedText
						k={
							status.canManage
								? "settings.connections.slackPage.gaveManage"
								: "settings.connections.slackPage.gaveLimited"
						}
					/>
				</p>
			</header>
			<MissingGrant missing={missing} slug={slug} />
			<SlackScopeGroups
				groups={groupScopes(status.scopes)}
				title={
					<LocalizedText k="settings.connections.slackPage.grantedTitle" />
				}
				withheld={missing.map(toLine)}
			/>
			<SlackChannels />
			<section className="flex flex-col gap-3 border-y px-(--spacing-block-inline) py-5">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="font-medium text-sm">
							<LocalizedText k="settings.connections.slackPage.agentsTitle" />
						</h2>
						<p className="text-muted-foreground text-xs">
							<LocalizedText k="settings.connections.slackPage.agentsNote" />
						</p>
					</div>
					<NewAgentDialog>
						<Button size="sm">
							<LocalizedText k="settings.connections.slackPage.newAgent" />
						</Button>
					</NewAgentDialog>
				</div>
				<div className="flex flex-col divide-y rounded-lg border">
					{agents.length === 0 ? (
						<p className="px-(--spacing-block-inline) py-4 text-muted-foreground text-sm">
							<LocalizedText k="settings.connections.slackPage.noAgents" />
						</p>
					) : null}
					{agents.map(
						(agent: {
							id: string;
							name: string;
							description: string | null;
							status: string;
						}) => (
							<Link
								className="flex items-center gap-3 px-(--spacing-block-inline) py-4 hover:bg-muted/50"
								href={`/${slug}/agents/${agent.id}`}
								key={agent.id}
							>
								<div className="min-w-0 flex-1">
									<h3 className="font-medium text-sm">{agent.name}</h3>
									<p className="truncate text-muted-foreground text-xs">
										{agent.description}
									</p>
								</div>
								<span className="flex w-19 shrink-0 items-center gap-2 text-xs">
									<span
										className={`size-2 rounded-full ${agent.status === "LIVE" ? "bg-success" : "bg-muted-foreground"}`}
									/>
									<LocalizedText
										k={
											agent.status === "LIVE"
												? "settings.connections.slackPage.running"
												: "settings.connections.slackPage.paused"
										}
									/>
								</span>
							</Link>
						),
					)}
					<Link
						className="px-(--spacing-block-inline) py-4 font-medium text-sm hover:bg-muted/50"
						href={`/${slug}/chat`}
					>
						<LocalizedText k="settings.connections.slackPage.describeAnother" />
					</Link>
				</div>
			</section>
			<div className="flex items-center justify-between gap-4 px-(--spacing-block-inline)">
				<p className="text-sm">
					{status.people.reviewed === 0 ? (
						<LocalizedText k="settings.connections.slackPage.peopleNone" />
					) : (
						<LocalizedValue
							k="settings.connections.slackPage.peopleMatched"
							values={{
								matched: status.people.matched,
								reviewed: status.people.reviewed,
							}}
						/>
					)}
				</p>
				<Button asChild variant="outline" size="sm">
					<Link href={`/${slug}/settings/connections/slack/people`}>
						<LocalizedText k="settings.connections.slackPage.review" />
					</Link>
				</Button>
			</div>
		</ConnectionPage>
	);
}

function MissingGrant({
	slug,
	missing,
}: {
	slug: string;
	missing: SlackScope[];
}) {
	if (missing.length === 0) return null;

	const privateChannels = missing.some((entry) =>
		PRIVATE_CHANNEL_SCOPES.includes(entry.scope),
	);

	return (
		<div className="px-(--spacing-block-inline)">
			<Alert variant="warning">
				<Icon icon={Warning} />
				<AlertTitle>
					{privateChannels ? (
						<LocalizedText k="settings.connections.slackPage.privateChannelsTitle" />
					) : (
						<LocalizedValue
							k="settings.connections.slackPage.heldBackTitle"
							values={{ count: missing.length }}
						/>
					)}
				</AlertTitle>
				<AlertDescription>
					<span>
						<LocalizedText k="settings.connections.slackPage.reconnectNote" />
					</span>
					<ul className="mt-2 flex flex-col gap-1.5">
						{missing.map((entry) => (
							<li className="flex items-start gap-2" key={entry.scope}>
								<Icon
									icon={Close}
									motion="none"
									className="mt-0.5 size-3.5 shrink-0"
								/>
								<span>{entry.grant}</span>
							</li>
						))}
					</ul>
				</AlertDescription>
				<AlertAction>
					<SlackReconnectButton slug={slug} />
				</AlertAction>
			</Alert>
		</div>
	);
}

function PlainList({
	title,
	items,
	icon,
	tone,
}: {
	title: React.ReactNode;
	items: React.ReactNode[];
	icon: React.ComponentType;
	tone: string;
}) {
	return (
		<section className="flex flex-col gap-3 px-(--spacing-block-inline)">
			<h2 className="font-medium text-sm">{title}</h2>
			<div className="flex flex-col gap-2">
				{items.map((item) => (
					<div className="flex items-start gap-3 text-sm" key={String(item)}>
						<Icon
							icon={icon}
							motion="none"
							className={`mt-0.5 size-4 shrink-0 ${tone}`}
						/>
						<span>{item}</span>
					</div>
				))}
			</div>
		</section>
	);
}
