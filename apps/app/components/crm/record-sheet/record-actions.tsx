"use client";

import Archive from "@carbon/icons-react/es/Archive";
import OverflowMenuVertical from "@carbon/icons-react/es/OverflowMenuVertical";
import TrashCan from "@carbon/icons-react/es/TrashCan";
import Undo from "@carbon/icons-react/es/Undo";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@crm/ui/components/alert-dialog";
import { Button } from "@crm/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@crm/ui/components/dropdown-menu";
import { Icon } from "@crm/ui/components/icon";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { t, tf, useLocale } from "@/components/locale-provider";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import {
	type RecordKind,
	type RecordRef,
	useRecordStack,
} from "./record-stack";

const RECORD_PROCEDURES = {
	company: "companies",
	contact: "contacts",
	deal: "deals",
} satisfies Record<RecordKind, "companies" | "contacts" | "deals">;

function useRecordActionHandlers(record: RecordRef) {
	const trpc = useTRPC();
	const cache = useCrmCache();
	const { close } = useRecordStack();
	const { messages } = useLocale();

	const displayName = (item: { name: string }) =>
		item.name ||
		tf(messages, "recordActions.fallbackName", {
			kind: t(messages, `recordKinds.${record.kind}` as const),
		});

	const onError = (error: { message: string }) => toast.error(error.message);

	const archive = useMutation(
		trpc[RECORD_PROCEDURES[record.kind]].archive.mutationOptions({
			onSuccess: (archived: { name: string }) => {
				toast.success(
					tf(messages, "recordActions.archivedToast", {
						name: displayName(archived),
					}),
				);
				void cache[record.kind](record.id);
			},
			onError,
		}),
	);

	const restore = useMutation(
		trpc[RECORD_PROCEDURES[record.kind]].restore.mutationOptions({
			onSuccess: (restored: { name: string }) => {
				toast.success(
					tf(messages, "recordActions.restoredToast", {
						name: displayName(restored),
					}),
				);
				void cache[record.kind](record.id);
			},
			onError,
		}),
	);

	const purge = useMutation(
		trpc[RECORD_PROCEDURES[record.kind]].purge.mutationOptions({
			onSuccess: (purged: { name: string }) => {
				toast.success(
					tf(messages, "recordActions.purgedToast", {
						name: displayName(purged),
					}),
				);
				void cache.removed(record);
				close();
			},
			onError,
		}),
	);

	return { archive, restore, purge };
}

export function RecordActions({
	record,
	name,
	consequence,
	archivedAt,
}: {
	record: RecordRef;
	name: string;
	consequence: string;
	archivedAt: string | null;
}) {
	const { messages } = useLocale();
	const [confirming, setConfirming] = useState(false);
	const { archive, restore, purge } = useRecordActionHandlers(record);

	const pending = archive.isPending || restore.isPending || purge.isPending;
	const kind = t(messages, `recordKinds.${record.kind}` as const);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon-sm" disabled={pending}>
						<Icon icon={OverflowMenuVertical} />
						<span className="sr-only">
							{t(messages, "recordActions.moreActions")}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-44">
					{archivedAt ? (
						<>
							<DropdownMenuItem
								onSelect={() => restore.mutate({ id: record.id })}
							>
								<Icon icon={Undo} />
								{tf(messages, "recordActions.restore", { kind })}
							</DropdownMenuItem>
							<DropdownMenuItem
								variant="destructive"
								onSelect={() => setConfirming(true)}
							>
								<Icon icon={TrashCan} />
								{tf(messages, "recordActions.deleteForever", { kind })}
							</DropdownMenuItem>
						</>
					) : (
						<DropdownMenuItem
							onSelect={() => archive.mutate({ id: record.id })}
						>
							<Icon icon={Archive} />
							{tf(messages, "recordActions.archive", { kind })}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={confirming} onOpenChange={setConfirming}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{tf(messages, "recordActions.deleteTitle", { name })}
						</AlertDialogTitle>
						<AlertDialogDescription>{consequence}</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>
							{t(messages, "recordActions.cancel")}
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => purge.mutate({ id: record.id })}
						>
							{t(messages, "recordActions.deleteConfirm")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
