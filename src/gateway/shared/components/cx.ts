export type ClassValue =
	| string
	| false
	| null
	| undefined
	| readonly ClassValue[];

const flatten = (classes: readonly ClassValue[]): string[] =>
	classes.flatMap((c) =>
		Array.isArray(c)
			? flatten(c)
			: typeof c === "string" && c !== ""
				? [c]
				: [],
	);

export const cx = (...classes: readonly ClassValue[]): string =>
	flatten(classes).join(" ");
