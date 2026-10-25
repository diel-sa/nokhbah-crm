"use client";

import type { Messages } from "@/lib/i18n/messages";
import { InlineScript } from "./inline-script";
import { useLocale } from "./locale-provider";

const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const LOCAL_DAY_OPTIONS = {
	month: "short",
	day: "numeric",
	year: "numeric",
} as const;

type TimeStrings = {
	now: string;
	ago: string;
	in: string;
	minute: string;
	hour: string;
	day: string;
};

function timeStrings(messages: Messages): TimeStrings {
	return {
		now: messages.timeAgo.justNow,
		ago: messages.timeAgo.ago,
		in: messages.timeAgo.in,
		minute: messages.timeAgo.minute,
		hour: messages.timeAgo.hour,
		day: messages.timeAgo.day,
	};
}

// Locale-specific literals for the pre-hydration script. Must stay in sync
// with the `timeAgo` message catalog.
const SCRIPT_TIME_STRINGS = {
	en: {
		now: "just now",
		ago: "{t} ago",
		in: "in {t}",
		minute: "m",
		hour: "h",
		day: "d",
	},
	ar: {
		now: "الآن",
		ago: "منذ {t}",
		in: "بعد {t}",
		minute: "د",
		hour: "س",
		day: "ي",
	},
} satisfies Record<string, TimeStrings>;

function scriptTimeStringsJson(): string {
	return JSON.stringify(SCRIPT_TIME_STRINGS).replace(/"/g, '\\"');
}

const LOCAL_DATE_TIME_SCRIPT = `{try{var W=JSON.parse("${scriptTimeStringsJson()}");var L=(document.documentElement.lang||"en").slice(0,2).toLowerCase();var w=W[L]||W.en;var s="time[data-local-date-kind]",f=function(n){try{var k=n.dataset.localDateKind,v=n.dataset.localDateValue,e=n.dataset.localDateEnd,o=JSON.parse(n.dataset.localDateOptions||"{}"),d=new Date(v),t=d.getTime(),x=Date.now()-t,a=Math.abs(x),r;if(k==="date-time")r=new Intl.DateTimeFormat(L,o).format(d);else if(k==="date-range")r=new Intl.DateTimeFormat(L,o).formatRange(d,new Date(e));else if(k==="day")r=new Intl.DateTimeFormat(L,o).format(new Date(v+"T00:00:00"));else if(k==="relative-date"){var z=new Date(),q=(Date.UTC(z.getFullYear(),z.getMonth(),z.getDate())-Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/${DAY_MS};r=new Intl.RelativeTimeFormat(L,{numeric:"auto"}).format(-q,"day")}else if(!Number.isFinite(t))r="—";else if(a<${MINUTE_MS})r=w.now;else if(a>=${30 * DAY_MS})r=new Intl.DateTimeFormat(L,{month:"short",day:"numeric"}).format(d);else{var u=a<${HOUR_MS}?Math.floor(a/${MINUTE_MS})+w.minute:a<${DAY_MS}?Math.floor(a/${HOUR_MS})+w.hour:Math.floor(a/${DAY_MS})+w.day;r=x<0?w.in.replace("{t}",u):w.ago.replace("{t}",u)}n.textContent=r}catch{}};var c=function(r){if(r.nodeType===1&&r.matches&&r.matches(s))f(r);if(r.querySelectorAll)r.querySelectorAll(s).forEach(f)};c(document);new MutationObserver(function(m){m.forEach(function(r){r.addedNodes.forEach(c)})}).observe(document.documentElement,{childList:true,subtree:true})}catch{}}`;

export function LocalDateTime({
	date,
	options,
}: {
	date: string;
	options: Intl.DateTimeFormatOptions;
}) {
	const { locale } = useLocale();
	return (
		<LocalTime
			kind="date-time"
			date={date}
			options={options}
			fallback={getDateTimeFormatter(locale, options).format(new Date(date))}
		/>
	);
}

export function LocalDateTimeRange({
	start,
	end,
	options,
}: {
	start: string;
	end: string;
	options: Intl.DateTimeFormatOptions;
}) {
	const { locale } = useLocale();
	return (
		<LocalTime
			kind="date-range"
			date={start}
			end={end}
			options={options}
			fallback={getDateTimeFormatter(locale, options).formatRange(
				new Date(start),
				new Date(end),
			)}
		/>
	);
}

export function LocalRelativeDate({ date }: { date: string }) {
	const { locale } = useLocale();
	return (
		<LocalTime
			kind="relative-date"
			date={date}
			fallback={formatRelativeDate(date, locale)}
		/>
	);
}

export function LocalRelativeTime({ date }: { date: string }) {
	const { locale, messages } = useLocale();
	return (
		<LocalTime
			kind="relative-time"
			date={date}
			fallback={formatRelativeTime(date, locale, timeStrings(messages))}
		/>
	);
}

export function LocalDay({ date }: { date: string }) {
	const { locale } = useLocale();
	const day = date.slice(0, 10);
	return (
		<LocalTime
			kind="day"
			date={day}
			options={LOCAL_DAY_OPTIONS}
			fallback={getDateTimeFormatter(locale, LOCAL_DAY_OPTIONS).format(
				dayDate(day),
			)}
		/>
	);
}

export function LocalDateTimeHydrator() {
	return <InlineScript html={LOCAL_DATE_TIME_SCRIPT} />;
}

function LocalTime({
	kind,
	date,
	end,
	options,
	fallback,
}: {
	kind: "date-time" | "date-range" | "day" | "relative-date" | "relative-time";
	date: string;
	end?: string;
	options?: Intl.DateTimeFormatOptions;
	fallback: string;
}) {
	return (
		<time
			dateTime={date}
			data-local-date-kind={kind}
			data-local-date-value={date}
			data-local-date-end={end}
			data-local-date-options={options ? JSON.stringify(options) : undefined}
			suppressHydrationWarning
		>
			{fallback}
		</time>
	);
}

function formatRelativeDate(date: string, locale: string): string {
	const now = new Date();
	const then = new Date(date);
	const days = (calendarDay(now) - calendarDay(then)) / DAY_MS;
	return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
		-days,
		"day",
	);
}

function formatRelativeTime(
	date: string,
	locale: string,
	strings: TimeStrings,
): string {
	const then = new Date(date).getTime();
	if (!Number.isFinite(then)) return "—";
	const difference = Date.now() - then;
	const absolute = Math.abs(difference);
	if (absolute < MINUTE_MS) return strings.now;
	if (absolute >= 30 * DAY_MS) {
		return getDateTimeFormatter(locale, {
			month: "short",
			day: "numeric",
		}).format(new Date(then));
	}

	const distance =
		absolute < HOUR_MS
			? `${Math.floor(absolute / MINUTE_MS)}${strings.minute}`
			: absolute < DAY_MS
				? `${Math.floor(absolute / HOUR_MS)}${strings.hour}`
				: `${Math.floor(absolute / DAY_MS)}${strings.day}`;
	return difference < 0
		? strings.in.replace("{t}", distance)
		: strings.ago.replace("{t}", distance);
}

function calendarDay(date: Date): number {
	return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayDate(day: string): Date {
	return new Date(`${day}T00:00:00`);
}

function getDateTimeFormatter(
	locale: string,
	options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
	const key = `${locale}:${JSON.stringify(options)}`;
	const cached = dateTimeFormatters.get(key);
	if (cached) return cached;

	const formatter = new Intl.DateTimeFormat(locale, options);
	dateTimeFormatters.set(key, formatter);
	return formatter;
}
