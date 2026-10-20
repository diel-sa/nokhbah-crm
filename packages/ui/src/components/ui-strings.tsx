"use client";

import { createContext, useContext, type ReactNode } from "react";

export type UiStrings = {
	filters: string;
	sort: string;
	sortBy: string;
	ascending: string;
	descending: string;
	columns: string;
	toggleColumns: string;
	detail: string;
	all: string;
	clear: string;
	selected: string;
	selectAllRows: string;
	selectRow: string;
	searchField: string;
	nothingMatches: string;
	noResultsFound: string;
	noResults: string;
	showingOf: string;
	previous: string;
	next: string;
};

const DEFAULT_STRINGS: UiStrings = {
	filters: "Filters",
	sort: "Sort",
	sortBy: "Sort by",
	ascending: "Ascending",
	descending: "Descending",
	columns: "Columns",
	toggleColumns: "Toggle columns",
	detail: "Detail",
	all: "All",
	clear: "Clear",
	selected: "{count} selected",
	selectAllRows: "Select every row on this page",
	selectRow: "Select row",
	searchField: "Search {field}…",
	nothingMatches: "Nothing matches.",
	noResultsFound: "No results found.",
	noResults: "No results",
	showingOf: "Showing {start}–{end} of {total}",
	previous: "Previous",
	next: "Next",
};

const UiStringsContext = createContext<UiStrings>(DEFAULT_STRINGS);

export function UiStringsProvider({
	strings,
	children,
}: {
	strings: Partial<UiStrings>;
	children: ReactNode;
}) {
	const value = { ...DEFAULT_STRINGS, ...strings };
	return (
		<UiStringsContext.Provider value={value}>
			{children}
		</UiStringsContext.Provider>
	);
}

export function useUiStrings(): UiStrings {
	return useContext(UiStringsContext);
}

export function formatUiString(
	template: string,
	vars: Record<string, string | number>,
): string {
	let value = template;
	for (const [key, replacement] of Object.entries(vars)) {
		value = value.replaceAll(`{${key}}`, String(replacement));
	}
	return value;
}
