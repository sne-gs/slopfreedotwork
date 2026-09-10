import { Fragment } from "hono/jsx/jsx-runtime";
import { Button, Checkbox, cx, Row, TextInput } from "#gateway/shared";
import type { Question } from "#utility/types";

export type { Question } from "#utility/types";

export const MAX_QUESTIONS = 10;

const sectionClass = cx(
	"bg-base-100",
	"border",
	"border-base-content",
	"gap-4",
	"grid",
	"p-4",
);

const headerClass = cx(
	"border-b",
	"border-base-300",
	"flex",
	"items-center",
	"justify-between",
	"pb-3",
);

const titleClass = cx(
	"text-base-content/60",
	"text-label",
	"tracking-label",
	"uppercase",
);

const addIconClass = cx("i-pixelarticons-plus", "mr-2", "text-2xl");

const emptyClass = cx("p-4", "text-base-content/50", "text-center", "text-sm");

const rowGapClass = cx("gap-2");

const questionRowClass = cx(
	"bg-base-200",
	"border",
	"border-base-300",
	"gap-3",
	"grid",
	"grid-cols-[auto_auto_auto_1fr_auto_auto]",
	"items-start",
	"p-3",
	"question-row",
);

const moveBtnClass = cx(
	"[&:hover:not(:disabled)]:bg-base-300",
	"bg-base-100",
	"border",
	"border-base-content",
	"cursor-pointer",
	"disabled:cursor-not-allowed",
	"disabled:opacity-30",
	"h-10",
	"inline-flex",
	"items-center",
	"justify-center",
	"text-base-content/60",
	"text-xs",
	"w-10",
);

const moveUpIconClass = cx("i-pixelarticons-chevron-up", "text-2xl");
const moveDownIconClass = cx("i-pixelarticons-chevron-down", "text-2xl");

const typeSelectClass = cx(
	"bg-base-100",
	"border",
	"border-base-content",
	"cursor-pointer",
	"h-8",
	"px-3",
	"text-xs",
	"tracking-tab",
	"uppercase",
);

const labelInputClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"h-8",
	"placeholder:text-base-content/50",
	"px-3",
	"text-sm",
	"w-full",
);

const requiredLabelClass = cx(
	"border",
	"border-base-content",
	"cursor-pointer",
	"gap-2",
	"inline-flex",
	"items-center",
	"px-2",
	"select-none",
	"text-base-content/60",
	"text-xs",
	"tracking-tab",
	"uppercase",
);

const checkboxClass = cx("hidden");

const removeBtnClass = cx(
	"bg-transparent",
	"border-0",
	"cursor-pointer",
	"h-10",
	"hover:underline",
	"inline-flex",
	"items-center",
	"justify-center",
	"px-3",
	"text-error",
	"text-xs",
);

const removeIconClass = cx("color-red", "i-pixelarticons-close", "text-2xl");

const optionsWrapClass = cx("gap-2");

const postAction = (questionsEndpoint: string): string =>
	`@post('${questionsEndpoint}', {contentType: 'form'})`;

const QuestionRow = ({
	question,
	index,
	count,
	postAction,
}: {
	readonly question: Question;
	readonly index: number;
	readonly count: number;
	readonly postAction: string;
}) => (
	<Fragment>
		<Row template="auto auto auto 1fr auto auto" classes={rowGapClass}>
			<Button
				size="sm"
				type="button"
				disabled={index === 0}
				name="questionAction"
				value={`up:${index}`}
				data-on:click={postAction}
			>
				<div class={moveUpIconClass} />
			</Button>
			<Button
				size="sm"
				type="button"
				disabled={index >= count - 1}
				name="questionAction"
				value={`down:${index}`}
				data-on:click={postAction}
			>
				<div class={moveDownIconClass} />
			</Button>
			<select
				class={typeSelectClass}
				name={`questionType${index}`}
				aria-label="Question type"
				data-on:change={postAction}
			>
				<option value="text" selected={question.type === "text"}>
					Text
				</option>
				<option value="textarea" selected={question.type === "textarea"}>
					Textarea
				</option>
				<option value="select" selected={question.type === "select"}>
					Select
				</option>
				<option value="file" selected={question.type === "file"}>
					File
				</option>
			</select>
			<input
				type="text"
				class={labelInputClass}
				name={`questionLabel${index}`}
				value={question.label}
				placeholder="Question label (e.g. Years of experience)"
				aria-label="Question label"
			/>
			<Checkbox
				name={`questionRequired${index}`}
				label="Required"
				checked={question.required}
			/>
			<Button
				size="sm"
				type="button"
				name="questionAction"
				value={`remove:${index}`}
				data-on:click={postAction}
			>
				<div class={removeIconClass} />
			</Button>
		</Row>
		<div
			class={cx(optionsWrapClass, question.type !== "select" && "hidden")}
			data-options
		>
			<TextInput
				size="sm"
				name={`questionOptions${index}`}
				value={question.options.join(", ")}
				placeholder="Options (comma-separated)"
				aria-label="Question options"
			/>
		</div>
	</Fragment>
);

const styleCarrier = (
	<div hidden aria-hidden="true">
		<div class={questionRowClass}>
			<button class={moveBtnClass} type="button" />
			<button class={moveBtnClass} type="button" />
			<select class={typeSelectClass}>
				<option value="text" />
				<option value="select" />
			</select>
			<input class={labelInputClass} />
			<label class={requiredLabelClass}>
				<input class={checkboxClass} type="checkbox" />
			</label>
			<button class={removeBtnClass} type="button" />
		</div>
		<div class={emptyClass} />
	</div>
);

export interface QuestionEditorProps {
	readonly questions: readonly Question[];
	readonly questionsEndpoint: string;
}

export const QuestionEditor = ({
	questions,
	questionsEndpoint,
}: QuestionEditorProps) => (
	<div class={sectionClass} id="questions-editor">
		<div class={headerClass}>
			<span class={titleClass}>Application Questions</span>
			<Button
				type="button"
				size="sm"
				disabled={questions.length >= MAX_QUESTIONS}
				name="questionAction"
				value="add"
				data-on:click={postAction(questionsEndpoint)}
			>
				<div class={addIconClass} />
				Add Question
			</Button>
		</div>
		{questions.length === 0 ? (
			<div class={emptyClass}>
				No custom questions. Applicants will submit with default fields only.
			</div>
		) : (
			questions.map((question, index) => (
				<QuestionRow
					question={question}
					index={index}
					count={questions.length}
					postAction={postAction(questionsEndpoint)}
				/>
			))
		)}
		{styleCarrier}
	</div>
);
