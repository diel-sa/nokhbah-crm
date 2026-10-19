"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";
export type Locale = "en" | "ar";

export async function getLocale(): Promise<Locale> {
	const c = await cookies();
	const lang = c.get(COOKIE_NAME)?.value;
	return lang === "ar" ? "ar" : "en";
}

export async function setLocale(locale: Locale) {
	const c = await cookies();
	c.set(COOKIE_NAME, locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
	});
}
