import { css } from "hono/css";
import { Button } from "#gateway/shared";

export type QuestionType = "text" | "textarea" | "select" | "file";

export interface Question {
	readonly id: string;
	readonly type: QuestionType;
	readonly label: string;
	readonly required: boolean;
	readonly options: readonly string[];
}

const MAX_QUESTIONS = 10;
const SLOT_INDICES = Array.from({ length: MAX_QUESTIONS }, (_, i) => i);

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
	display: grid;
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

const isQuestionType = (t: unknown): t is QuestionType =>
	t === "text" || t === "textarea" || t === "select" || t === "file";

/** Guarantees every seeded question has every field, so `q.label.trim()` can never hit undefined. */
const normalizeQuestion = (
	q: Partial<Question> | null | undefined,
): Question => {
	const type = q?.type;
	return {
		id: typeof q?.id === "string" ? q.id : "",
		type: isQuestionType(type) ? type : "text",
		label: typeof q?.label === "string" ? q.label : "",
		required: q?.required !== false,
		options: Array.isArray(q?.options)
			? q.options.filter((o): o is string => typeof o === "string")
			: [],
	};
};

// ... all your css`...` constants unchanged ...

export interface QuestionEditorProps {
	readonly name?: string;
	readonly initialValue?: readonly Question[];
}

export const QuestionEditor = ({
	name = "customFormSchema",
	initialValue = [],
}: QuestionEditorProps) => {
	const initialQuestions = initialValue.map(normalizeQuestion);
	return (
		<div
			class={sectionClass}
			data-signals:questions={JSON.stringify(initialQuestions)}
			data-signals:qcounter={String(initialQuestions.length)}
		>
			<div class={headerClass}>
				<span class={titleClass}>Application Questions</span>
				<Button
					type="button"
					size="small"
					variant="secondary"
					data-attr:disabled="$questions.length >= 10"
					data-on:click="$questions = [...$questions, {id: 'q' + (++$qcounter), type: 'text', label: '', required: true, options: []}]"
				>
					+ Add Question
				</Button>
			</div>

			<div data-attr:style="$questions.length > 0 ? 'display:none' : ''">
				<div class={emptyClass}>
					No custom questions. Applicants will submit with default fields only.
				</div>
			</div>

			{SLOT_INDICES.map((i) => (
				<div
					class={questionRowClass}
					data-attr:style={`$questions.length <= ${i} ? 'display:none' : ''`}
				>
					<button
						type="button"
						class={moveBtnClass}
						data-attr:disabled={`${i} === 0 || $questions.length <= ${i}`}
						data-on:click={`${i} > 0 && $questions.length > ${i} && ($questions = $questions.map((x, idx) => idx === ${i} ? $questions[${i} - 1] : idx === ${i} - 1 ? $questions[${i}] : x))`}
					>
						↑
					</button>
					<button
						type="button"
						class={moveBtnClass}
						data-attr:disabled={`${i} >= $questions.length - 1`}
						data-on:click={`${i} < $questions.length - 1 && ($questions = $questions.map((x, idx) => idx === ${i} ? $questions[${i} + 1] : idx === ${i} + 1 ? $questions[${i}] : x))`}
					>
						↓
					</button>
					<select
						class={typeSelectClass}
						data-attr:value={`$questions[${i}]?.type || 'text'`}
						data-on:change={`$questions = $questions.map((x, idx) => idx === ${i} ? {...x, type: evt.target.value, options: evt.target.value === 'select' ? (x.options && x.options.length ? x.options : ['']) : []} : x)`}
					>
						<option value="text">Text</option>
						<option value="textarea">Textarea</option>
						<option value="select">Select</option>
						<option value="file">File</option>
					</select>
					<input
						type="text"
						class={labelInputClass}
						placeholder="Question label (e.g. Years of experience)"
						data-attr:value={`$questions[${i}]?.label || ''`}
						data-on:input={`$questions = $questions.map((x, idx) => idx === ${i} ? {...x, label: evt.target.value} : x)`}
					/>
					<label class={requiredLabelClass}>
						<input
							type="checkbox"
							class={checkboxClass}
							data-attr:checked={`$questions[${i}]?.required !== false`}
							data-on:change={`$questions = $questions.map((x, idx) => idx === ${i} ? {...x, required: evt.target.checked} : x)`}
						/>
						Req
					</label>
					<button
						type="button"
						class={removeBtnClass}
						data-on:click={`$questions = $questions.filter((_, idx) => idx !== ${i})`}
					>
						✕
					</button>
					<div
						class={optionsWrapClass}
						data-attr:style={`$questions[${i}]?.type === 'select' ? '' : 'display:none'`}
					>
						<input
							type="text"
							class={optionsInputClass}
							placeholder="Options (comma-separated: Option A, Option B, Option C)"
							data-attr:value={`($questions[${i}]?.options || []).join(', ')`}
							data-on:change={`$questions = $questions.map((x, idx) => idx === ${i} ? {...x, options: evt.target.value.split(',').map(s => s.trim()).filter(Boolean)} : x)`}
						/>
					</div>
				</div>
			))}

			<input
				type="hidden"
				name={name}
				data-attr:value="JSON.stringify($questions.filter(q => q && typeof q.label === 'string' && q.label.trim().length > 0))"
			/>
		</div>
	);
};
