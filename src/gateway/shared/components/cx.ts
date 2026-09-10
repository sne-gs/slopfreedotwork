export type ClassValue = string | false | null | undefined | ClassValue[];

const flatten = (classes: ClassValue[]): string[] =>
	classes.flatMap((c) =>
		Array.isArray(c)
			? flatten(c)
			: typeof c === "string" && c !== ""
				? [c]
				: [],
	);

export const cx = (...classes: ClassValue[]): string =>
	flatten(classes).join(" ");
