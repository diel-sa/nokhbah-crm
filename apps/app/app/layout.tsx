import "@crm/ui/globals.css";
import { Toaster } from "@crm/ui/components/sonner";
import { TooltipProvider } from "@crm/ui/components/tooltip";
import { cn } from "@crm/ui/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { LocalDateTimeHydrator } from "@/components/local-date-time";
import { LocaleProvider } from "@/components/locale-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/lib/trpc/client";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

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

const LOCALE_BOOT_SCRIPT = `try{var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);if(m&&m[1]==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			dir="ltr"
			suppressHydrationWarning
			className={cn(
				fontSans.variable,
				fontMono.variable,
				fontArabic.variable,
				"h-full antialiased",
			)}
		>
			<body className="flex min-h-full flex-col font-sans">
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static constant, no user input */}
				<script dangerouslySetInnerHTML={{ __html: LOCALE_BOOT_SCRIPT }} />
				<NuqsAdapter>
					<TRPCReactProvider>
						<ThemeProvider>
							<LocaleProvider messages={{ en: enMessages, ar: arMessages }}>
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
