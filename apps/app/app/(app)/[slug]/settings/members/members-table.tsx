"use client";

import OverflowMenuHorizontal from "@carbon/icons-react/es/OverflowMenuHorizontal";
import { Button } from "@crm/ui/components/button";
import {
	DataTable,
	type DataTableColumn,
	type DataTableFacet,
} from "@crm/ui/components/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@crm/ui/components/dropdown-menu";
import { Icon } from "@crm/ui/components/icon";
import { PersonAvatar } from "@crm/ui/components/person-avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListSearch } from "@/components/data-table/list-search";
import { useTableQuery } from "@/components/data-table/use-table-query";
import { LocalRelativeTime } from "@/components/local-date-time";
import { t, tf, useLocale } from "@/components/locale-provider";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { membersSearchParams } from "./members-search-params";

type Role = "owner" | "admin" | "member";

type MemberRow = RouterOutputs["workspace"]["members"]["rows"][number];

function roleLabel(messages: Parameters<typeof t>[0], role: Role): string {
	return t(
		messages,
		`settings.membersPage.role${role.charAt(0).toUpperCase()}${role.slice(1)}`,
	);
}

function columns(
	messages: Parameters<typeof t>[0],
	canChangeRoles: boolean,
	onChangeRole: (member: MemberRow, role: Role) => void,
	pending: boolean,
): DataTableColumn<MemberRow>[] {
	return [
		{
			id: "name",
			header: t(messages, "settings.membersPage.colName"),
			sortable: true,
			hideable: false,
			width: "w-[34%]",
			cell: (row) => (
				<span className="flex min-w-0 items-center gap-2">
					<PersonAvatar
						size="sm"
						src={row.image}
						name={row.name}
						email={row.email}
					/>
					<span className="truncate font-medium">{row.name}</span>
					{row.isViewer ? (
						<span className="text-muted-foreground text-xs">
							{t(messages, "settings.membersPage.you")}
						</span>
					) : null}
				</span>
			),
		},
		{
			id: "email",
			header: t(messages, "settings.membersPage.colEmail"),
			sortable: true,
			width: "w-[32%]",
			hideBelow: "md",
			cell: (row) => (
				<span className="truncate text-muted-foreground">{row.email}</span>
			),
		},
		{
			id: "role",
			header: t(messages, "settings.membersPage.colRole"),
			sortable: true,
			width: "w-[14%]",
			cell: (row) => (
				<span className="text-muted-foreground">
					{roleLabel(messages, row.role as Role)}
				</span>
			),
		},
		{
			id: "joinedAt",
			header: t(messages, "settings.membersPage.colJoined"),
			label: t(messages, "settings.membersPage.joinedLabel"),
			sortable: true,
			align: "right",
			width: "w-[14%]",
			hideBelow: "sm",
			cell: (row) => (
				<span className="text-muted-foreground">
					<LocalRelativeTime date={row.joinedAt} />
				</span>
			),
		},
		{
			id: "actions",
			header: (
				<span className="sr-only">
					{t(messages, "settings.membersPage.colActions")}
				</span>
			),
			label: t(messages, "settings.membersPage.actionsLabel"),
			hideable: false,
			align: "right",
			width: "w-[6%]",
			cell: (row) =>
				canChangeRoles ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" disabled={pending}>
								<Icon icon={OverflowMenuHorizontal} />
								<span className="sr-only">
									{tf(messages, "settings.membersPage.changeRoleSr", {
										name: row.name,
									})}
								</span>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end">
							{(["owner", "admin", "member"] as Role[]).map((role) => (
								<DropdownMenuItem
									key={role}
									data-checked={row.role === role}
									onSelect={() => {
										if (row.role === role) return;
										onChangeRole(row, role);
									}}
								>
									{roleLabel(messages, role)}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				) : null,
		},
	];
}

export function MembersTable() {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const { query, input } = useTableQuery(membersSearchParams);

	const workspace = useQuery(trpc.workspace.get.queryOptions());
	const members = useQuery({
		...trpc.workspace.members.queryOptions(input),
		placeholderData: (previous) => previous,
	});

	const setRole = useMutation(
		trpc.workspace.setMemberRole.mutationOptions({
			onSuccess: async () => {
				await cache.workspace();
				toast.success(t(messages, "settings.membersPage.roleChangedToast"));
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	const facetCounts = members.data?.facetCounts;

	const facets: DataTableFacet[] = [
		{
			id: "role",
			label: t(messages, "settings.membersPage.colRole"),
			options: (["owner", "admin", "member"] as Role[]).flatMap((role) =>
				(facetCounts?.role?.[role] ?? 0) > 0
					? [{ value: role, label: roleLabel(messages, role) }]
					: [],
			),
		},
	];

	return (
		<DataTable
			query={query}
			search={
				<ListSearch
					placeholder={t(messages, "settings.membersPage.searchPlaceholder")}
				/>
			}
			columns={columns(
				messages,
				workspace.data?.canChangeRoles ?? false,
				(member, role) => setRole.mutate({ memberId: member.id, role }),
				setRole.isPending,
			)}
			rows={members.data?.rows ?? []}
			total={members.data?.total ?? 0}
			facetCounts={facetCounts}
			facets={facets}
			getRowId={(row) => row.id}
			loading={members.isFetching}
			empty={t(messages, "settings.membersPage.empty")}
		/>
	);
}
