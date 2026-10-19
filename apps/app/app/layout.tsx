import "@crm/ui/globals.css";
import { Toaster } from "@crm/ui/components/sonner";
import { TooltipProvider } from "@crm/ui/components/tooltip";
import { cn } from "@crm/ui/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { LocalDateTimeHydrator } from "@/components/local-date-time";
import { LocaleProvider } from "@/components/locale-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getMessages } from "@/lib/i18n/messages";
import { TRPCReactProvider } from "@/lib/trpc/client";

const fontSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const fontMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const fontArabic = Noto_Sans_Arabic({
	variable: "--font-arabic",
	subsets: ["arabic"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "Comp AI - CRM",
		template: "%s · Comp AI CRM",
	},
	description: "Customer Relationship Management for Comp AI",
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

async function getLocale() {
	const c = await cookies();
	const lang = c.get("NEXT_LOCALE")?.value;
	return lang === "ar" ? "ar" : "en";
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const isAr = locale === "ar";
	const messages = await getMessages(locale);
	return (
		<html
			lang={locale}
			dir={isAr ? "rtl" : "ltr"}
			suppressHydrationWarning
			className={cn(
				fontSans.variable,
				fontMono.variable,
				fontArabic.variable,
				"h-full antialiased",
				isAr && "font-arabic",
			)}
		>
			<body className="flex min-h-full flex-col font-sans">
				<NuqsAdapter>
					<TRPCReactProvider>
						<ThemeProvider>
							<LocaleProvider locale={locale} messages={messages}>
								<TooltipProvider>{children}</TooltipProvider>
								<Toaster richColors />
							</LocaleProvider>
						</ThemeProvider>
					</TRPCReactProvider>
				</NuqsAdapter>
				<LocalDateTimeHydrator />
			</body>
		</html>
	);
}
