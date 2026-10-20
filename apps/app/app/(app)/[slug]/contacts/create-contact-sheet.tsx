"use client";

import Add from "@carbon/icons-react/es/Add";
import { Button } from "@crm/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@crm/ui/components/field";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";
import { type ComponentProps, Suspense, useId, useState } from "react";
import { toast } from "sonner";
import { t, tf, useLocale } from "@/components/locale-provider";
import { CompanyPicker } from "@/components/crm/company-picker";
import { useOpenRecord } from "@/components/crm/record-sheet/record-stack";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

const NONE = "none";

function AddButton({
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

export function CreateContactSheet({ companyId }: { companyId?: string }) {
	const { messages } = useLocale();
	const label = t(messages, "contacts.newContact");
	return (
		<Suspense fallback={<AddButton label={label} disabled />}>
			<CreateContactForm companyId={companyId} />
		</Suspense>
	);
}

function CreateContactForm({ companyId }: { companyId?: string }) {
	const openRecord = useOpenRecord();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const { messages } = useLocale();

	const [open, setOpen] = useQueryState(
		SEARCH_PARAM.dialog.create,
		parseAsBoolean.withDefault(false),
	);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [title, setTitle] = useState("");
	const [company, setCompany] = useState(companyId ?? NONE);
	const [ownerId, setOwnerId] = useState(NONE);

	const firstNameId = useId();
	const lastNameId = useId();
	const emailId = useId();
	const titleId = useId();

	const users = useQuery(trpc.users.list.queryOptions());

	const create = useMutation(
		trpc.contacts.create.mutationOptions({
			onSuccess: async (contact) => {
				await cache.contact(contact.id);
				toast.success(
					tf(messages, "companies.added", {
						name: [contact.firstName, contact.lastName]
							.filter(Boolean)
							.join(" "),
					}),
				);
				await setOpen(null);
				setFirstName("");
				setLastName("");
				setEmail("");
				setTitle("");
				openRecord({ kind: "contact", id: contact.id });
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	return (
		<Sheet open={open} onOpenChange={(next) => setOpen(next || null)}>
			<SheetTrigger asChild>
				<AddButton label={t(messages, "contacts.newContact")} />
			</SheetTrigger>
			<SheetContent side="right">
				<SheetHeader>
					<SheetTitle>{t(messages, "contacts.newContact")}</SheetTitle>
					<SheetDescription>
						{t(messages, "contacts.newDescription")}
					</SheetDescription>
				</SheetHeader>

				<form
					id="create-contact"
					className="flex-1 overflow-y-auto px-4"
					onSubmit={(event) => {
						event.preventDefault();
						create.mutate({
							firstName,
							lastName: lastName || undefined,
							email: email || undefined,
							title: title || undefined,
							companyId: company === NONE ? null : company,
							ownerId: ownerId === NONE ? null : ownerId,
						});
					}}
				>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={firstNameId}>
								{t(messages, "common.firstName")}
							</FieldLabel>
							<Input
								id={firstNameId}
								value={firstName}
								onChange={(event) => setFirstName(event.target.value)}
								autoComplete="off"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={lastNameId}>
								{t(messages, "common.lastName")}
							</FieldLabel>
							<Input
								id={lastNameId}
								value={lastName}
								onChange={(event) => setLastName(event.target.value)}
								autoComplete="off"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={emailId}>{t(messages, "common.email")}</FieldLabel>
							<Input
								id={emailId}
								type="email"
								dir="ltr"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								autoComplete="off"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={titleId}>{t(messages, "common.title")}</FieldLabel>
							<Input
								id={titleId}
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="Head of Security"
								autoComplete="off"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="create-contact-company">
								{t(messages, "common.company")}
							</FieldLabel>
							<CompanyPicker
								id="create-contact-company"
								value={company}
								onValueChange={setCompany}
								none={{ value: NONE, label: t(messages, "common.noCompany") }}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="create-contact-owner">
								{t(messages, "common.owner")}
							</FieldLabel>
							<Select value={ownerId} onValueChange={setOwnerId}>
								<SelectTrigger id="create-contact-owner">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>
										{t(messages, "common.unassigned")}
									</SelectItem>
									{(users.data ?? []).map((user) => (
										<SelectItem key={user.id} value={user.id}>
											{user.name}
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
						form="create-contact"
						disabled={create.isPending || firstName.trim() === ""}
					>
						{create.isPending ? <Spinner /> : null}
						{t(messages, "contacts.addContact")}
					</Button>
					<SheetClose asChild>
						<Button variant="outline">{t(messages, "common.cancel")}</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
