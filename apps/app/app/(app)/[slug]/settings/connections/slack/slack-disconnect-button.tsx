"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@crm/ui/components/alert-dialog";
import {
	AsyncButtonContent,
	useAsyncAction,
} from "@crm/ui/components/async-action";
import { Button } from "@crm/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { t, tf, useLocale } from "@/components/locale-provider";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

export function SlackDisconnectButton({
	canManage,
	workspace,
}: {
	canManage: boolean;
	workspace: string | null;
}) {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const router = useRouter();
	const [confirming, setConfirming] = useState(false);
	const disconnect = useMutation(
		trpc.slack.disconnect.mutationOptions({
			onSuccess: async () => {
				await cache.slack();
				setConfirming(false);
				toast.success(
					t(messages, "settings.connections.disconnect.disconnectedToast"),
				);
				router.refresh();
			},
			onError: (error) => toast.error(error.message),
		}),
	);
	const disconnectAction = useAsyncAction({
		action: () => disconnect.mutateAsync(),
	});

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setConfirming(true)}
				disabled={!canManage || disconnectAction.pending}
			>
				{t(messages, "settings.connections.disconnect.disconnect")}
			</Button>

			<AlertDialog
				open={confirming}
				onOpenChange={(open) => {
					if (!disconnectAction.pending) setConfirming(open);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{tf(messages, "settings.connections.disconnect.disconnectTitle", {
								workspace: workspace ?? "Slack",
							})}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(
								messages,
								"settings.connections.disconnect.disconnectDescription",
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={disconnectAction.pending}>
							{t(messages, "common.cancel")}
						</AlertDialogCancel>
						<Button
							variant="destructive"
							disabled={disconnectAction.pending}
							onClick={() => void disconnectAction.run()}
						>
							<AsyncButtonContent
								status={disconnectAction.status}
								pendingLabel={t(
									messages,
									"settings.connections.disconnect.disconnecting",
								)}
							>
								{t(messages, "settings.connections.disconnect.disconnect")}
							</AsyncButtonContent>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
