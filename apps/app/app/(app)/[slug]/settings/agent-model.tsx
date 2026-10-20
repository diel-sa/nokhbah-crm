"use client";

import ChevronDown from "@carbon/icons-react/es/ChevronDown";
import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@crm/ui/components/command";
import { Icon } from "@crm/ui/components/icon";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@crm/ui/components/popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { t, tf, useLocale } from "@/components/locale-provider";
import { useCrmCache } from "@/lib/trpc/cache";
import { useTRPC } from "@/lib/trpc/client";

type CatalogModel = {
	id: string;
	name: string;
	provider: string;
	contextWindowTokens: number;
	pricing: { input: number; output: number } | null;
};

const FOLLOW_DEFAULT = "__default__";

type Messages = Parameters<typeof t>[0];

function perMillion(rate: number): string {
	const dollars = rate * 1_000_000;
	return `$${dollars.toFixed(2).replace(/\.?0+$/, "")}`;
}

function priceHint(model: CatalogModel, messages: Messages): string | null {
	if (!model.pricing) return null;
	return tf(messages, "settings.agentModel.pricePerMillion", {
		input: perMillion(model.pricing.input),
		output: perMillion(model.pricing.output),
	});
}

function contextHint(tokens: number, messages: Messages): string {
	const size =
		tokens >= 1_000_000
			? `${Math.round(tokens / 1_000_000)}M`
			: `${Math.round(tokens / 1_000)}K`;
	return tf(messages, "settings.agentModel.context", { size });
}

function byProvider(models: CatalogModel[]): [string, CatalogModel[]][] {
	const groups = new Map<string, CatalogModel[]>();

	for (const model of models) {
		const list = groups.get(model.provider) ?? [];
		list.push(model);
		groups.set(model.provider, list);
	}

	return [...groups];
}

export function AgentModel() {
	const { messages } = useLocale();
	const trpc = useTRPC();
	const cache = useCrmCache();
	const [open, setOpen] = useState(false);

	const settings = useQuery(trpc.settings.agentModel.queryOptions());
	const catalog = useQuery(trpc.settings.modelCatalog.queryOptions());

	const save = useMutation(
		trpc.settings.setAgentModel.mutationOptions({
			onSuccess: async () => {
				await cache.settings();
				toast.success(t(messages, "settings.agentModel.savedToast"));
			},
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!settings.data) return null;

	const { selectedId, effectiveId, defaultId, effective } = settings.data;
	const models = catalog.data?.models ?? [];
	const unavailable = catalog.data !== undefined && !catalog.data.available;

	const defaultModel = models.find((model) => model.id === defaultId);
	const current = selectedId ?? FOLLOW_DEFAULT;

	const effectiveName = effective?.name ?? effectiveId;

	const currentLabel = selectedId
		? effectiveName
		: tf(messages, "settings.agentModel.default", { name: effectiveName });

	const choose = (id: string) => {
		setOpen(false);
		if (id === current) return;
		save.mutate({ modelId: id === FOLLOW_DEFAULT ? null : id });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t(messages, "settings.agentModel.title")}</CardTitle>
				<CardDescription>
					{t(messages, "settings.agentModel.description")}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							aria-label={t(messages, "settings.agentModel.modelAria")}
							disabled={save.isPending || catalog.isPending || unavailable}
						>
							{currentLabel}
							<Icon icon={ChevronDown} data-icon="inline-end" />
						</Button>
					</PopoverTrigger>

					<PopoverContent align="start" size="fit" className="w-96">
						<Command>
							<CommandInput
								placeholder={t(
									messages,
									"settings.agentModel.searchPlaceholder",
								)}
							/>
							<CommandList>
								<CommandEmpty>
									{t(messages, "settings.agentModel.noMatch")}
								</CommandEmpty>

								<CommandGroup>
									<CommandItem
										value={`default ${defaultId}`}
										data-checked={current === FOLLOW_DEFAULT}
										onSelect={() => choose(FOLLOW_DEFAULT)}
									>
										{tf(messages, "settings.agentModel.default", {
											name: defaultModel?.name ?? defaultId,
										})}
									</CommandItem>
								</CommandGroup>

								{byProvider(models).map(([provider, group]) => (
									<CommandGroup key={provider} heading={provider}>
										{group.map((model) => {
											const price = priceHint(model, messages);

											return (
												<CommandItem
													key={model.id}
													value={`${model.name} ${model.provider} ${model.id}`}
													data-checked={current === model.id}
													onSelect={() => choose(model.id)}
												>
													<span>{model.name}</span>
													<span className="ml-auto text-muted-foreground text-xs">
														{price ??
															contextHint(model.contextWindowTokens, messages)}
													</span>
												</CommandItem>
											);
										})}
									</CommandGroup>
								))}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>

				<p className="text-muted-foreground text-xs">
					{unavailable
						? tf(messages, "settings.agentModel.unavailable", {
								model: effectiveId,
							})
						: effective
							? `${effectiveId} · ${contextHint(effective.contextWindowTokens, messages)}${
									priceHint(effective, messages)
										? ` · ${priceHint(effective, messages)}`
										: ""
								}`
							: effectiveId}
				</p>
			</CardContent>
		</Card>
	);
}
