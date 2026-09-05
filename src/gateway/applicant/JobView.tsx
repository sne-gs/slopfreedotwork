import { css, cx } from "hono/css";
import type { JSX } from "hono/jsx/jsx-runtime";
import { Button, Col, Row, renderMarkdown } from "#gateway/shared";
import type { JobWithCompanyRow } from "#manager/jobs";
import type { Question } from "#utility/types";

const formClass = css`
        height: 100%;
        background-color: var(--color-base-100);
        padding: var(--spacing-4xl);
`;

const jobTitleClass = css`
        font-size: var(--text-5xl);
        font-weight: var(--weight-normal);
        line-height: var(--leading-tight);
        margin: 0;
        padding: var(--spacing-sm);
`;

const jobContainerClass = css`
        display: flex;
        align-items: center;
        padding-inline: var(--spacing-default);
`;

const jobMetaLabelClass = css`
        font-weight: var(--weight-bold);
        text-wrap: nowrap;
        padding: var(--spacing-sm);
`;

const jobMetaValueClass = css`
        padding: var(--spacing-sm);
        font-size: var(--text-base);
`;

const postedByClass = css`
        display: flex;
        align-items: center;
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-faint);
`;

const proseClass = css`
        padding: var(--spacing-default);
        border-top: var(--line-width-default) solid var(--color-base-300);
        border-bottom: var(--line-width-default) solid var(--color-base-300);
        font-size: var(--text-base);
        line-height: var(--leading-normal);
        overflow-wrap: anywhere;
        & > :first-child {
                margin-top: 0;
        }
        & > :last-child {
                margin-bottom: 0;
        }
        & h1 {
                margin: var(--spacing-lg) 0 var(--spacing-sm);
                font-size: var(--text-2xl);
                font-weight: var(--weight-semibold);
                line-height: var(--leading-tight);
        }
        & h2 {
                margin: var(--spacing-lg) 0 var(--spacing-sm);
                font-size: var(--text-xl);
                font-weight: var(--weight-semibold);
                line-height: var(--leading-tight);
        }
        & h3 {
                margin: var(--spacing-lg) 0 var(--spacing-sm);
                font-size: var(--text-lg);
                font-weight: var(--weight-semibold);
                line-height: var(--leading-tight);
        }
        & h4 {
                margin: var(--spacing-lg) 0 var(--spacing-sm);
                font-size: var(--text-base);
                font-weight: var(--weight-semibold);
        }
        & h5 {
                margin: var(--spacing-lg) 0 var(--spacing-sm);
                font-size: var(--text-base);
                font-weight: var(--weight-semibold);
        }
        & h6 {
                margin: var(--spacing-lg) 0 var(--spacing-sm);
                font-size: var(--text-base);
                font-weight: var(--weight-semibold);
                color: var(--color-content-muted);
        }
        & p {
                margin: var(--spacing-sm) 0;
        }
        & ul {
                margin: var(--spacing-sm) 0;
                padding-left: var(--space-6);
                list-style: disc;
        }
        & ol {
                margin: var(--spacing-sm) 0;
                padding-left: var(--space-6);
                list-style: decimal;
        }
        & li {
                margin: var(--spacing-xs) 0;
                list-style: inherit;
        }
        & a {
                color: inherit;
                text-decoration: underline;
                text-underline-offset: 2px;
        }
        & strong {
                font-weight: var(--weight-semibold);
        }
        & del {
                color: var(--color-content-muted);
        }
        & blockquote {
                margin: var(--spacing-sm) 0;
                padding-left: var(--spacing-default);
                border-left: var(--line-width-default) solid var(--color-base-300);
                color: var(--color-content-muted);
        }
        & code {
                font-family: var(--font-mono);
                font-size: var(--text-sm);
                background-color: var(--color-base-200);
                padding: 0.1em 0.35em;
        }
        & pre {
                margin: var(--spacing-sm) 0;
                padding: var(--spacing-default);
                background-color: var(--color-base-200);
                overflow-x: auto;
        }
        & pre code {
                padding: 0;
                background: none;
        }
        & hr {
                border: 0;
                border-top: var(--line-width-default) solid var(--color-base-300);
                margin: var(--spacing-lg) 0;
        }
`;

const sectionClass = css`
        display: grid;
        gap: var(--spacing-default);
        padding: var(--spacing-default);
        border: var(--line-width-default) solid var(--color-base-content);
        background-color: var(--color-base-100);
`;

const sectionHeaderClass = css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: var(--spacing-sm);
        border-bottom: var(--line-width-default) solid var(--color-base-300);
`;

const sectionTitleClass = css`
        font-size: var(--text-label);
        text-transform: uppercase;
        letter-spacing: var(--tracking-label);
        color: var(--color-content-muted);
`;

const fieldRowClass = css`
        display: grid;
        gap: var(--spacing-xs);
        padding: var(--spacing-sm) 0;
`;

const fieldLabelClass = css`
        font-size: var(--text-sm);
        font-weight: var(--weight-medium);
`;

const fieldClass = css`
        background-color: transparent;
        border: 0;
        border-bottom: var(--line-width-default) solid var(--color-base-content);
        padding: var(--spacing-sm);
        width: 100%;
        font-size: var(--text-base);
        font-family: inherit;
        color: inherit;
        &:focus {
                outline: none;
        }
`;

const textareaFieldClass = css`
        resize: vertical;
        min-height: var(--space-20);
`;

const selectFieldClass = css`
        cursor: pointer;
`;

const fileFieldClass = css`
        font-size: var(--text-sm);
`;

const questionFieldName = (question: Question, index: number): string =>
	`question_${question.id || `q${index + 1}`}`;

const QuestionField = ({
	question,
	index,
}: {
	readonly question: Question;
	readonly index: number;
}) => {
	const name = questionFieldName(question, index);

	let field: JSX.Element;
	if (question.type === "textarea") {
		field = (
			<textarea
				id={name}
				name={name}
				rows={4}
				class={cx(fieldClass, textareaFieldClass)}
				required={question.required}
			/>
		);
	} else if (question.type === "select") {
		field = (
			<select
				id={name}
				name={name}
				class={cx(fieldClass, selectFieldClass)}
				required={question.required}
			>
				<option value="" disabled selected>
					Please select
				</option>
				{question.options.map((option) => (
					<option value={option}>{option}</option>
				))}
			</select>
		);
	} else if (question.type === "file") {
		field = (
			<input
				id={name}
				name={name}
				type="file"
				class={cx(fieldClass, fileFieldClass)}
				required={question.required}
			/>
		);
	} else {
		field = (
			<input
				id={name}
				name={name}
				type="text"
				class={fieldClass}
				required={question.required}
			/>
		);
	}

	return (
		<div class={fieldRowClass}>
			<label class={fieldLabelClass} for={name}>
				{question.label} {question.required ? "*" : null}
			</label>
			{field}
		</div>
	);
};

export interface JobViewProps {
	readonly job: JobWithCompanyRow;
	readonly questions: readonly Question[];
}

export const JobView = ({ job, questions }: JobViewProps) => {
	const bodyHtml = renderMarkdown(job.description);

	return (
		<form class={formClass}>
			<Col template="auto auto 1fr auto auto" gap="md">
				<div class={jobContainerClass}>
					<h1 class={jobTitleClass}>{job.title}</h1>
				</div>
				<Row gap="md">
					<div class={jobContainerClass}>
						<span class={jobMetaLabelClass}>Location</span>
						<span class={jobMetaValueClass}>{job.location ?? "—"}</span>
					</div>
					<div class={jobContainerClass}>
						<span class={jobMetaLabelClass}>Job Type</span>
						<span class={jobMetaValueClass}>{job.jobType ?? "—"}</span>
					</div>
				</Row>
				{bodyHtml ? (
					<div
						class={proseClass}
						dangerouslySetInnerHTML={{ __html: bodyHtml }}
					/>
				) : null}
				{questions.length > 0 ? (
					<div class={sectionClass}>
						<div class={sectionHeaderClass}>
							<span class={sectionTitleClass}>Application Questions</span>
						</div>
						{questions.map((question, index) => (
							<QuestionField question={question} index={index} />
						))}
					</div>
				) : null}
				<Row template="1fr auto auto" gap="sm">
					<span class={postedByClass}>Posted by {job.companyName}</span>
					<a variant="secondary" href="/applicant/jobs">
						Back
					</a>
					<Button type="submit" disabled>
						Apply
					</Button>
				</Row>
			</Col>
		</form>
	);
};
