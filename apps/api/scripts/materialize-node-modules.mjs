import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const store = join(root, "node_modules/.bun");
const outDir = resolve(here, "../dist/node_modules");

const copied = new Set();

function findInStore(name) {
	if (!existsSync(store)) return null;
	const prefix = name.startsWith("@")
		? name.split("/")[0] + "+" + name.split("/")[1]
		: name;
	const matches = readdirSync(store).filter((d) => d.startsWith(prefix + "@"));
	if (matches.length === 0) return null;
	return join(store, matches[0], "node_modules", name);
}

function copyPackage(name) {
	if (copied.has(name)) return;
	copied.add(name);
	const src = findInStore(name);
	if (!src) {
		console.warn(`materialize: ${name} not found in bun store, skipping`);
		return;
	}
	const dest = join(outDir, name);
	mkdirSync(dirname(dest), { recursive: true });
	cpSync(src, dest, { recursive: true, dereference: true });

	let pkg;
	try {
		pkg = JSON.parse(readFileSync(join(src, "package.json"), "utf8"));
	} catch {
		return;
	}
	for (const dep of Object.keys(pkg.dependencies ?? {})) {
		copyPackage(dep);
	}
	for (const dep of Object.keys(pkg.peerDependencies ?? {})) {
		if (!dep.startsWith("@types/")) copyPackage(dep);
	}
}

const entry = process.argv[2] ?? "express";
mkdirSync(outDir, { recursive: true });
copyPackage(entry);
console.log(`materialized ${copied.size} packages from ${entry}`);
