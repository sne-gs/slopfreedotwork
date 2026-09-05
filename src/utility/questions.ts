import type { Question, QuestionType } from "#utility/types";

export const isQuestionType = (t: unknown): t is QuestionType =>
	t === "text" || t === "textarea" || t === "select" || t === "file";

export const normalizeQuestionInput = (raw: unknown): Question => {
	const q = (raw ?? {}) as Partial<Question>;
	return {
		id: typeof q.id === "string" ? q.id : "",
		type: isQuestionType(q.type) ? q.type : "text",
		label: typeof q.label === "string" ? q.label : "",
		required: q.required !== false,
		options: Array.isArray(q.options)
			? q.options.filter((o): o is string => typeof o === "string")
			: [],
	};
};

export const questionsFromSchema = (schema: string | null): Question[] => {
	if (!schema) return [];
	try {
		const parsed: unknown = JSON.parse(schema);
		return Array.isArray(parsed) ? parsed.map(normalizeQuestionInput) : [];
	} catch {
		return [];
	}
};
