const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const isSafeHref = (href: string): boolean =>
	/^(?:https?:\/\/|mailto:|\/)/i.test(href);

const applyInline = (text: string): string =>
	text
		.replace(
			/\[([^\]]+)\]\(([^)\s]+)\)/g,
			(match: string, label: string, href: string): string =>
				isSafeHref(href)
					? `<a href="${href}" rel="noopener noreferrer">${label}</a>`
					: match,
		)
		.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		.replace(/(?<!\w)__([^_]+)__(?!\w)/g, "<strong>$1</strong>")
		.replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
		.replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, "<em>$1</em>")
		.replace(/~~([^~]+)~~/g, "<del>$1</del>");

const renderInline = (escaped: string): string =>
	escaped
		.split(/`([^`]+)`/g)
		.map((part, index) =>
			index % 2 === 1 ? `<code>${part}</code>` : applyInline(part),
		)
		.join("");

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const HR_RE = /^(?:-{3,}|\*{3,}|_{3,})$/;
const UL_RE = /^[-*+]\s+/;
const OL_RE = /^\d+[.)]\s+/;
const FENCE_RE = /^```/;

const MAX_QUOTE_DEPTH = 5;

const renderBlocks = (lines: string[], depth = 0): string => {
	const out: string[] = [];
	let paragraph: string[] = [];
	let index = 0;

	const flushParagraph = (): void => {
		if (paragraph.length > 0) {
			out.push(`<p>${renderInline(escapeHtml(paragraph.join(" ")))}</p>`);
			paragraph = [];
		}
	};

	while (index < lines.length) {
		const trimmed = lines[index].trim();

		if (trimmed === "") {
			flushParagraph();
			index += 1;
			continue;
		}

		if (FENCE_RE.test(trimmed)) {
			flushParagraph();
			const code: string[] = [];
			index += 1;
			while (index < lines.length && !FENCE_RE.test(lines[index].trim())) {
				code.push(lines[index]);
				index += 1;
			}
			index += 1;
			out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
			continue;
		}

		const heading = HEADING_RE.exec(trimmed);
		if (heading) {
			flushParagraph();
			const level = heading[1].length;
			out.push(
				`<h${level}>${renderInline(escapeHtml(heading[2].trim()))}</h${level}>`,
			);
			index += 1;
			continue;
		}

		if (HR_RE.test(trimmed)) {
			flushParagraph();
			out.push("<hr />");
			index += 1;
			continue;
		}

		if (trimmed.startsWith(">")) {
			flushParagraph();
			const quoted: string[] = [];
			while (index < lines.length && lines[index].trim().startsWith(">")) {
				quoted.push(lines[index].trim().replace(/^>\s?/, ""));
				index += 1;
			}
			const body =
				depth < MAX_QUOTE_DEPTH
					? renderBlocks(quoted.join("\n").split("\n"), depth + 1)
					: `<p>${renderInline(escapeHtml(quoted.join(" ")))}</p>`;
			out.push(`<blockquote>${body}</blockquote>`);
			continue;
		}

		if (UL_RE.test(trimmed)) {
			flushParagraph();
			const items: string[] = [];
			while (index < lines.length && UL_RE.test(lines[index].trim())) {
				items.push(lines[index].trim().replace(UL_RE, ""));
				index += 1;
			}
			out.push(
				`<ul>${items
					.map((item) => `<li>${renderInline(escapeHtml(item))}</li>`)
					.join("")}</ul>`,
			);
			continue;
		}

		if (OL_RE.test(trimmed)) {
			flushParagraph();
			const items: string[] = [];
			while (index < lines.length && OL_RE.test(lines[index].trim())) {
				items.push(lines[index].trim().replace(OL_RE, ""));
				index += 1;
			}
			out.push(
				`<ol>${items
					.map((item) => `<li>${renderInline(escapeHtml(item))}</li>`)
					.join("")}</ol>`,
			);
			continue;
		}

		paragraph.push(trimmed);
		index += 1;
	}

	flushParagraph();
	return out.join("\n");
};

export const renderMarkdown = (source: string): string =>
	renderBlocks((source ?? "").replace(/\r\n?/g, "\n").split("\n"));
