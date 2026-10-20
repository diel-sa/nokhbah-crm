"use client";

import { Button } from "@crm/ui/components/button";
import { cn } from "@crm/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { t, useLocale } from "@/components/locale-provider";
import { useWorkspaceUrl } from "@/lib/use-workspace-url";

type SettingsNavItem = {
	titleKey: string;
	href: string;
};

const ROOT = "/settings";

const ITEMS: SettingsNavItem[] = [
	{ titleKey: "settings.nav.general", href: ROOT },
	{ titleKey: "settings.nav.tracking", href: `${ROOT}/tracking` },
	{ titleKey: "settings.nav.connections", href: `${ROOT}/connections` },
	{ titleKey: "settings.nav.currencies", href: `${ROOT}/currencies` },
	{ titleKey: "settings.nav.members", href: `${ROOT}/members` },
	{ titleKey: "settings.nav.apiKeys", href: `${ROOT}/api-keys` },
	{ titleKey: "settings.nav.sso", href: `${ROOT}/sso` },
];

function isActive(href: string, root: string, pathname: string): boolean {
	return href === root ? pathname === href : pathname.startsWith(href);
}

function NavLink({
	label,
	href,
	active,
	className,
}: {
	label: string;
	href: string;
	active: boolean;
	className: string;
}) {
	return (
		<Button
			asChild
			variant="ghost"
			className={cn(
				"justify-start font-normal text-muted-foreground",
				active &&
					"bg-muted text-foreground hover:bg-muted hover:text-foreground",
				className,
			)}
		>
			<Link
				href={href}
				prefetch
				aria-current={active ? "page" : undefined}
				transitionTypes={["nav-lateral"]}
			>
				{label}
			</Link>
		</Button>
	);
}

export function SettingsSidebarFallback() {
	const { messages } = useLocale();
	return (
		<>
			<aside className="hidden w-56 shrink-0 border-r md:block [view-transition-name:settings-sidebar]">
				<nav
					aria-label="Workspace settings"
					aria-busy="true"
					className="flex flex-col gap-0.5 p-3"
				>
					{ITEMS.map((item) => (
						<Button
							key={item.href}
							variant="ghost"
							disabled
							className="w-full justify-start px-3 font-normal text-muted-foreground"
						>
							{t(messages, item.titleKey)}
						</Button>
					))}
				</nav>
			</aside>

			<nav
				aria-label="Workspace settings"
				aria-busy="true"
				className="flex gap-1 overflow-x-auto border-b p-2 md:hidden [view-transition-name:settings-sidebar]"
			>
				{ITEMS.map((item) => (
					<Button
						key={item.href}
						variant="ghost"
						disabled
						className="shrink-0 justify-start px-3 font-normal text-muted-foreground"
					>
						{t(messages, item.titleKey)}
					</Button>
				))}
			</nav>
		</>
	);
}

export function SettingsSidebar() {
	const pathname = usePathname();
	const workspaceUrl = useWorkspaceUrl();
	const { messages } = useLocale();

	const root = workspaceUrl(ROOT);
	const items = useMemo(
		() => ITEMS.map((item) => ({ ...item, href: workspaceUrl(item.href) })),
		[workspaceUrl],
	);
	const labels = useMemo(
		() =>
			Object.fromEntries(
				ITEMS.map((item) => [item.titleKey, t(messages, item.titleKey)]),
			),
		[messages],
	);

	return (
		<>
			<aside className="hidden w-56 shrink-0 border-r md:block [view-transition-name:settings-sidebar]">
				<nav
					aria-label="Workspace settings"
					className="flex flex-col gap-0.5 p-3"
				>
					{items.map((item) => (
						<NavLink
							key={item.href}
							label={labels[item.titleKey] ?? item.titleKey}
							href={item.href}
							active={isActive(item.href, root, pathname)}
							className="w-full px-3"
						/>
					))}
				</nav>
			</aside>

			<nav
				aria-label="Workspace settings"
				className="flex gap-1 overflow-x-auto border-b p-2 md:hidden [view-transition-name:settings-sidebar]"
			>
				{items.map((item) => (
					<NavLink
						key={item.href}
						label={labels[item.titleKey] ?? item.titleKey}
						href={item.href}
						active={isActive(item.href, root, pathname)}
						className="shrink-0 px-3"
					/>
				))}
			</nav>
		</>
	);
}
