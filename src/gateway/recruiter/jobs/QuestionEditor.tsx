import { css } from "hono/css";
import { Button } from "#gateway/shared";
import type { Question } from "#utility/types";

export type { Question } from "#utility/types";

export const MAX_QUESTIONS = 10;

const QUESTIONS_ENDPOINT = "/recruiter/jobs/add/questions";

const sectionClass = css`
        display: grid;
        gap: var(--spacing-default);
        padding: var(--spacing-default);
        border: var(--line-width-default) solid var(--color-base-content);
        background-color: var(--color-base-100);
`;

const headerClass = css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: var(--spacing-sm);
        border-bottom: var(--line-width-default) solid var(--color-base-300);
`;

const titleClass = css`
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-muted);
`;

const emptyClass = css`
        padding: var(--spacing-default);
        text-align: center;
        font-size: var(--text-sm);
        color: var(--color-content-faint);
`;

const questionRowClass = css`
        display: grid;
        grid-template-columns: auto auto auto 1fr auto auto;
        gap: var(--spacing-sm);
        align-items: start;
        padding: var(--spacing-sm);
        border: var(--line-width-default) solid var(--color-base-300);
        background-color: var(--color-base-200);
        & > [data-options] {
                display: none;
        }
        &:has(> select[name^="questionType"] option[value="select"]:checked)
                > [data-options] {
                display: grid;
        }
`;

const moveBtnClass = css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--control-height-sm);
        height: var(--control-height-sm);
        border: var(--line-width-default) solid var(--color-base-content);
        background-color: var(--color-base-100);
        cursor: pointer;
        font-size: var(--text-xs);
        color: var(--color-content-muted);
        &:hover:not(:disabled) {
                background-color: var(--color-base-300);
        }
        &:disabled {
                opacity: 0.3;
                cursor: not-allowed;
        }
`;

const typeSelectClass = css`
        height: var(--control-height-sm);
        border: var(--line-width-default) solid var(--color-base-content);
        background-color: var(--color-base-100);
        padding-inline: var(--spacing-sm);
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: var(--tracking-tab);
        cursor: pointer;
`;

const labelInputClass = css`
        height: var(--control-height-sm);
        width: 100%;
        border: 0;
        border-bottom: var(--line-width-default) solid var(--color-base-content);
        background-color: transparent;
        padding: 0 var(--spacing-sm);
        font-size: var(--text-sm);
        &:focus {
                outline: none;
        }
        &::placeholder {
                color: var(--color-content-faint);
        }
`;

const requiredLabelClass = css`
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-muted);
        cursor: pointer;
        user-select: none;
`;

const checkboxClass = css`
        accent-color: var(--color-neutral);
        cursor: pointer;
`;

const removeBtnClass = css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: var(--control-height-sm);
        padding-inline: var(--spacing-sm);
        border: 0;
        background: none;
        font-size: var(--text-xs);
        color: var(--color-error);
        cursor: pointer;
        &:hover {
                text-decoration: underline;
        }
`;

const optionsWrapClass = css`
        display: none;
        gap: var(--spacing-xs);
        grid-column: 4 / -1;
        padding-top: var(--spacing-xs);
`;

const optionsInputClass = css`
        height: var(--control-height-sm);
        width: 100%;
        border: 0;
        border-bottom: var(--line-width-default) dashed var(--color-base-content);
        background-color: transparent;
        padding: 0 var(--spacing-sm);
        font-size: var(--text-xs);
        color: var(--color-content-muted);
        &:focus {
                outline: none;
                color: var(--color-base-content);
        }
        &::placeholder {
                color: var(--color-content-faint);
        }
`;

const postQuestionsAction = `@post('${QUESTIONS_ENDPOINT}', {contentType: 'form'})`;

const QuestionRow = ({
	question,
	index,
	count,
}: {
	readonly question: Question;
	readonly index: number;
	readonly count: number;
}) => (
	<div class={questionRowClass}>
		<button
			type="button"
			class={moveBtnClass}
			disabled={index === 0}
			name="questionAction"
			value={`up:${index}`}
			data-on:click={postQuestionsAction}
		>
			↑
		</button>
		<button
			type="button"
			class={moveBtnClass}
			disabled={index >= count - 1}
			name="questionAction"
			value={`down:${index}`}
			data-on:click={postQuestionsAction}
		>
			↓
		</button>
		<select
			class={typeSelectClass}
			name={`questionType${index}`}
			aria-label="Question type"
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
		<label class={requiredLabelClass}>
			<input
				type="checkbox"
				class={checkboxClass}
				name={`questionRequired${index}`}
				checked={question.required}
			/>
			Req
		</label>
		<button
			type="button"
			class={removeBtnClass}
			name="questionAction"
			value={`remove:${index}`}
			data-on:click={postQuestionsAction}
		>
			✕
		</button>
		<div class={optionsWrapClass} data-options>
			<input
				type="text"
				class={optionsInputClass}
				name={`questionOptions${index}`}
				value={question.options.join(", ")}
				placeholder="Options (comma-separated: Option A, Option B, Option C)"
				aria-label="Question options"
			/>
		</div>
	</div>
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
			<div class={optionsWrapClass} data-options>
				<input class={optionsInputClass} />
			</div>
		</div>
		<div class={emptyClass} />
	</div>
);

export interface QuestionEditorProps {
	readonly questions: readonly Question[];
}

export const QuestionEditor = ({ questions }: QuestionEditorProps) => (
	<div class={sectionClass} id="questions-editor">
		<div class={headerClass}>
			<span class={titleClass}>Application Questions</span>
			<Button
				type="button"
				size="sm"
				disabled={questions.length >= MAX_QUESTIONS}
				name="questionAction"
				value="add"
				data-on:click={postQuestionsAction}
			>
				+ Add Question
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
				/>
			))
		)}
		{styleCarrier}
	</div>
);
