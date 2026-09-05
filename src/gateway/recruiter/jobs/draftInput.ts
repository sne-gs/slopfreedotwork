import { isQuestionType } from "#utility/questions";
import type { DraftInput } from "#utility/types";

export {
	isQuestionType,
	normalizeQuestionInput,
	questionsFromSchema,
} from "#utility/questions";

const QUESTION_INDEX_RE = /^questionType(\d+)$/;

type FormEntry = string | Blob;

const asString = (value: FormEntry | null): string =>
	typeof value === "string" ? value : "";

export const parseDraftForm = (form: FormData): DraftInput => {
	const indices = new Set<number>();
	for (const key of form.keys()) {
		const match = QUESTION_INDEX_RE.exec(key);
		if (match) indices.add(Number(match[1]));
	}

	const questions = [...indices]
		.sort((a, b) => a - b)
		.map((i) => {
			const type = form.get(`questionType${i}`);
			const label = asString(form.get(`questionLabel${i}`));
			const required = form.has(`questionRequired${i}`);
			const rawOptions = asString(form.get(`questionOptions${i}`))
				.split(",")
				.map((option) => option.trim())
				.filter(Boolean);
			return {
				id: `q${i + 1}`,
				type: isQuestionType(type) ? type : "text",
				label,
				required,
				options: type === "select" ? rawOptions : [],
			};
		});

	return {
		title: asString(form.get("jobTitle")),
		location: asString(form.get("jobLocation")),
		jobType: asString(form.get("jobType")),
		description: asString(form.get("jobDescription")),
		questions,
	};
};
