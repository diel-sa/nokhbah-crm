"use client";

import Add from "@carbon/icons-react/es/Add";
import { Button } from "@crm/ui/components/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@crm/ui/components/field";
import { Icon } from "@crm/ui/components/icon";
import { Input } from "@crm/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@crm/ui/components/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@crm/ui/components/sheet";
import { Spinner } from "@crm/ui/components/spinner";
import { useMutation } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";
import { type ComponentProps, Suspense, useId, useState } from "react";
import { toast } from "sonner";
import { t, useLocale } from "@/components/locale-provider";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { CreatedApiKeyDialog } from "./created-api-key-dialog";

const FORM = "create-api-key";

const EXPIRATION_OPTIONS = [
	{ value: "30", key: "settings.apiKeys.opt30" },
	{ value: "90", key: "settings.apiKeys.opt90" },
	{ value: "365", key: "settings.apiKeys.opt365" },
	{ value: "never", key: "settings.apiKeys.optNever" },
] as const;

type ExpirationValue = (typeof EXPIRATION_OPTIONS)[number]["value"];

type CreatedApiKey = RouterOutputs["apiKeys"]["create"];

function NewApiKeyButton({
	label,
	...props
}: ComponentProps<typeof Button> & { label: string }) {
	return (
		<Button {...props}>
			<Icon icon={Add} data-icon="inline-start" />
			{label}
		</Button>
	);
}

export function CreateApiKeySheet() {
	const { messages } = useLocale();

	return (
		<Suspense
			fallback={
				<NewApiKeyButton
					disabled
					label={t(messages, "settings.apiKeys.newKey")}
				/>
			}
		>
			<CreateApiKeyForm />
		</Suspense>
	);
}

function CreateApiKeyForm() {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();

	const nameId = useId();
	const expirationId = useId();

	const [open, setOpen] = useQueryState(
		SEARCH_PARAM.dialog.create,
		parseAsBoolean.withDefault(false),
	);
	const [name, setName] = useState("");
	const [expiration, setExpiration] = useState<ExpirationValue>("90");
	const [created, setCreated] = useState<CreatedApiKey | null>(null);

	const create = useMutation(
		trpc.apiKeys.create.mutationOptions({
			onSuccess: async (apiKey) => {
				await cache.apiKeys();
				await setOpen(null);
				setName("");
				setExpiration("90");
				setCreated(apiKey);
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	return (
		<>
			<Sheet open={open} onOpenChange={(next) => setOpen(next || null)}>
				<SheetTrigger asChild>
					<NewApiKeyButton label={t(messages, "settings.apiKeys.newKey")} />
				</SheetTrigger>

				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>
							{t(messages, "settings.apiKeys.sheetTitle")}
						</SheetTitle>
						<SheetDescription>
							{t(messages, "settings.apiKeys.sheetDescription")}
						</SheetDescription>
					</SheetHeader>

					<form
						id={FORM}
						className="flex-1 overflow-y-auto px-4"
						onSubmit={(event) => {
							event.preventDefault();
							create.mutate({
								name: name.trim(),
								expiresInDays:
									expiration === "never" ? null : Number(expiration),
							});
						}}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor={nameId}>
									{t(messages, "settings.apiKeys.nameLabel")}
								</FieldLabel>
								<Input
									id={nameId}
									value={name}
									onChange={(event) => setName(event.target.value)}
									placeholder={t(messages, "settings.apiKeys.namePlaceholder")}
									maxLength={64}
									autoComplete="off"
									autoCapitalize="off"
									autoCorrect="off"
									spellCheck={false}
									required
								/>
								<FieldDescription>
									{t(messages, "settings.apiKeys.nameHint")}
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor={expirationId}>
									{t(messages, "settings.apiKeys.expires")}
								</FieldLabel>
								<Select
									value={expiration}
									onValueChange={(value) =>
										setExpiration(value as ExpirationValue)
									}
								>
									<SelectTrigger id={expirationId} className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{EXPIRATION_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{t(messages, option.key)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						</FieldGroup>
					</form>

					<SheetFooter>
						<Button
							type="submit"
							form={FORM}
							disabled={!name.trim() || create.isPending}
						>
							{create.isPending ? <Spinner /> : null}
							{t(messages, "settings.apiKeys.createKey")}
						</Button>
						<SheetClose asChild>
							<Button variant="outline">{t(messages, "common.cancel")}</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			<CreatedApiKeyDialog
				apiKey={created}
				onOpenChange={(next) => {
					if (!next) setCreated(null);
				}}
			/>
		</>
	);
}
