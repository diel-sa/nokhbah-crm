"use client";

import Archive from "@carbon/icons-react/es/Archive";
import Renew from "@carbon/icons-react/es/Renew";
import Undo from "@carbon/icons-react/es/Undo";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@crm/ui/components/dropdown-menu";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
	BulkActionsMenu,
	BulkDeleteDialog,
	BulkOwnerMenu,
	reportBulk,
} from "@/components/crm/bulk-actions";
import { CompanyMenuSearch } from "@/components/crm/company-picker";
import { useLocale } from "@/components/locale-provider";
import { formatCountL } from "@/lib/i18n/format-count";
import type { Messages } from "@/lib/i18n/messages";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

function contacts(count: number, messages: Messages): string {
	return formatCountL(messages, count, "contact");
}

export function ContactsBulkActions({
	ids,
	onDone,
	archived,
}: {
	ids: string[];
	onDone: () => void;
	archived: boolean;
}) {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const users = useQuery(trpc.users.list.queryOptions());
	const [menuOpen, setMenuOpen] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const companySearch = useRef<HTMLInputElement>(null);

	const onError = (error: { message: string }) => toast.error(error.message);

	const assignOwner = useMutation(
		trpc.contacts.bulkAssignOwner.mutationOptions({
			onSuccess: async (result) => {
				await cache.contact();
				reportBulk(
					result,
					(count) => `${formatCountL(messages, count, "contact")} reassigned.`,
				);
				onDone();
			},
			onError,
		}),
	);

	const setCompany = useMutation(
		trpc.contacts.bulkSetCompany.mutationOptions({
			onSuccess: async (result) => {
				await cache.contact();
				reportBulk(result, (count) => `${contacts(count, messages)} moved.`);
				onDone();
			},
			onError,
		}),
	);

	const enrich = useMutation(
		trpc.contacts.bulkEnrich.mutationOptions({
			onSuccess: async (result) => {
				await cache.contact();
				reportBulk(
					result,
					(count) =>
						`Looking up ${contacts(count, messages)} — the table will update.`,
				);
				onDone();
			},
			onError,
		}),
	);

	const archive = useMutation(
		trpc.contacts.bulkArchive.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.removedMany({ kind: "contact", ids: variables.ids });
				reportBulk(
					result,
					(count) => `${formatCountL(messages, count, "contact")} archived.`,
				);
				onDone();
			},
			onError,
		}),
	);

	const restore = useMutation(
		trpc.contacts.bulkRestore.mutationOptions({
			onSuccess: async (result) => {
				await cache.contact();
				reportBulk(result, (count) => `${contacts(count, messages)} restored.`);
				onDone();
			},
			onError,
		}),
	);

	const purge = useMutation(
		trpc.contacts.bulkPurge.mutationOptions({
			onSuccess: async (result, variables) => {
				await cache.removedMany({ kind: "contact", ids: variables.ids });
				reportBulk(
					result,
					(count) => `${contacts(count, messages)} deleted forever.`,
				);
				setConfirming(false);
				onDone();
			},
			onError,
		}),
	);

	if (archived) {
		const pending = restore.isPending || purge.isPending;

		return (
			<>
				<BulkActionsMenu pending={pending}>
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => restore.mutate({ ids })}>
							<Undo />
							Restore
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							variant="destructive"
							onSelect={() => setConfirming(true)}
						>
							Delete forever
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</BulkActionsMenu>

				<BulkDeleteDialog
					open={confirming}
					onOpenChange={setConfirming}
					title={`Delete ${contacts(ids.length, messages)} forever?`}
					description="Their email addresses are suppressed, so the inbox sync will not file them again. This cannot be undone."
					onConfirm={() => purge.mutate({ ids })}
				/>
			</>
		);
	}

	const pending =
		assignOwner.isPending ||
		setCompany.isPending ||
		enrich.isPending ||
		archive.isPending;

	return (
		<BulkActionsMenu
			pending={pending}
			open={menuOpen}
			onOpenChange={setMenuOpen}
		>
			<BulkOwnerMenu
				users={users.data ?? []}
				unassignedLabel="Nobody"
				onSelect={(ownerId) => assignOwner.mutate({ ids, ownerId })}
			/>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>Move to company</DropdownMenuSubTrigger>
				<DropdownMenuSubContent
					className="w-64 p-0"
					onFocus={(event) => {
						if (event.target === event.currentTarget) {
							companySearch.current?.focus();
						}
					}}
				>
					<CompanyMenuSearch
						none="No company"
						inputRef={companySearch}
						onSelect={(companyId) => {
							setMenuOpen(false);
							setCompany.mutate({ ids, companyId });
						}}
					/>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
			<DropdownMenuGroup>
				<DropdownMenuItem onSelect={() => enrich.mutate({ ids })}>
					<Renew />
					Re-enrich
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem onSelect={() => archive.mutate({ ids })}>
					<Archive />
					Archive
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</BulkActionsMenu>
	);
}
