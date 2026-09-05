import { type Context, Hono } from "hono";
import type { AppEnv } from "#gateway/shared";
import { parseDraftForm } from "./draftInput";
import { resolveDraft } from "./draftSupport";
import {
	questionsEditorResponse,
	renderFragment,
	savedAtText,
	statusResponse,
} from "./patch";
import { MAX_QUESTIONS, QuestionEditor } from "./QuestionEditor";

export const questions = new Hono();

type QuestionAction =
	| { readonly verb: "add" }
	| { readonly verb: "up" | "down" | "remove"; readonly index: number };

type FormEntry = string | Blob;

const parseAction = (raw: FormEntry | null): QuestionAction | null => {
	if (typeof raw !== "string") return null;
	const [verb, rawIndex] = raw.split(":");
	if (verb === "add") return { verb: "add" };
	if (verb === "up" || verb === "down" || verb === "remove") {
		const index = Number(rawIndex);
		if (!Number.isInteger(index) || index < 0) return null;
		return { verb, index };
	}
	return null;
};

questions.post("/", async (c: Context<AppEnv>) => {
	const resolution = await resolveDraft(c);
	if (!resolution.ok) return resolution.response;
	const { mgr, draftId } = resolution;

	const form = await c.req.raw.formData();
	const parsed = parseDraftForm(form);

	const action = parseAction(form.get("questionAction"));
	if (!action) return statusResponse("Unknown question action");

	let list = [...parsed.questions];
	switch (action.verb) {
		case "add": {
			if (list.length >= MAX_QUESTIONS) {
				return statusResponse(`Maximum of ${MAX_QUESTIONS} questions`);
			}
			list = [
				...list,
				{
					id: `q${list.length + 1}`,
					type: "text",
					label: "",
					required: true,
					options: [],
				},
			];
			break;
		}
		case "remove": {
			if (action.index >= list.length) {
				return statusResponse("That question is already gone");
			}
			list = list.filter((_, index) => index !== action.index);
			break;
		}
		case "up": {
			const { index } = action;
			if (index === 0 || index >= list.length) break;
			[list[index - 1], list[index]] = [list[index], list[index - 1]];
			break;
		}
		case "down": {
			const { index } = action;
			if (index >= list.length - 1) break;
			[list[index + 1], list[index]] = [list[index], list[index + 1]];
			break;
		}
	}

	list = list.map((question, index) => ({ ...question, id: `q${index + 1}` }));

	await mgr.saveDraft(draftId, { ...parsed, questions: list });

	const fragment = await renderFragment(<QuestionEditor questions={list} />);
	return questionsEditorResponse(fragment, savedAtText());
});
