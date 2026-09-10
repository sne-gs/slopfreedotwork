import type { AutoCompleteExtractor } from "unocss";

const stringRE = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`/g;
const cxCallRE = /\bcx\s*\(/g;

const matchParen = (
	content: string,
	from: number,
	strings: Array<[number, number]>,
): number => {
	let p = strings.findIndex(([s]) => s >= from);
	let depth = 0;
	for (let i = from; i < content.length; i++) {
		const s = strings[p];
		if (s && i === s[0]) {
			i = s[1];
			p++;
			continue;
		}
		const c = content.charAt(i);
		if (c === "(" || c === "[") depth++;
		else if (c === ")" || c === "]") {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
};

export const cxExtractor: AutoCompleteExtractor = {
	name: "cx-call-strings",
	extract({ content, cursor }) {
		const strings: Array<[number, number]> = [];
		for (const m of content.matchAll(stringRE)) {
			const open = m.index;
			if (open === undefined) continue;
			strings.push([open, open + m[0].length - 1]);
		}

		const active = strings.find(
			([open, close]) => cursor > open && cursor <= close,
		);
		if (!active) return null;

		let call: [number, number] | undefined;
		for (const m of content.matchAll(cxCallRE)) {
			const start = m.index;
			if (start === undefined) continue;
			const end = matchParen(content, start + m[0].length - 1, strings);
			if (end === -1) continue;
			if (
				active[0] > start &&
				active[1] < end &&
				(!call || end - start < call[1] - call[0])
			)
				call = [start, end];
		}
		if (!call) return null;

		const [open, close] = active;
		if (content.charAt(open) === "`") {
			const body = content.slice(open + 1, cursor);
			const dollar = body.lastIndexOf("${");
			if (dollar !== -1 && !body.slice(dollar).includes("}")) return null;
		}

		let start = cursor;
		let end = cursor;
		while (start > open + 1 && !/\s/.test(content.charAt(start - 1))) start--;
		while (end < close && !/\s/.test(content.charAt(end))) end++;
		return {
			extracted: content.slice(start, end),
			resolveReplacement: (suggestion: string) => ({
				start,
				end,
				replacement: suggestion,
			}),
		};
	},
};
