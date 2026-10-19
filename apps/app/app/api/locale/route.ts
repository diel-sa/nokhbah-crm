import { NextResponse } from "next/server";
import { type Locale, setLocale } from "@/lib/i18n/locale";

export async function POST(request: Request) {
	const { locale } = (await request.json()) as { locale: Locale };
	if (locale !== "en" && locale !== "ar") {
		return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
	}
	await setLocale(locale);
	return NextResponse.json({ ok: true });
}
