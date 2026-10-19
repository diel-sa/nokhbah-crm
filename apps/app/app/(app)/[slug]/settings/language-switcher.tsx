"use client";

import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Check, Globe } from "lucide-react";
import { t, useLocale } from "@/components/locale-provider";

export function LanguageSwitcher() {
	const { locale, messages, setLocale } = useLocale();
	return (
		<Card id="language">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Globe className="h-4 w-4" />
					{t(messages, "settings.languageLabel")}
				</CardTitle>
				<CardDescription>
					{t(messages, "settings.languageDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex gap-2">
					<Button
						variant={locale === "en" ? "default" : "outline"}
						size="sm"
						onClick={() => setLocale("en")}
						className="gap-2"
					>
						{locale === "en" && <Check className="h-4 w-4" />}
						{t(messages, "common.english")}
					</Button>
					<Button
						variant={locale === "ar" ? "default" : "outline"}
						size="sm"
						onClick={() => setLocale("ar")}
						className="gap-2"
					>
						{locale === "ar" && <Check className="h-4 w-4" />}
						{t(messages, "common.arabic")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
