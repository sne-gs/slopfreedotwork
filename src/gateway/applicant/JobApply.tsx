import type { JSX } from "hono/jsx/jsx-runtime";
import { Fragment } from "hono/jsx/jsx-runtime";
import { Button, Col, cx, Link, Row } from "#gateway/shared";
import type { JobWithCompanyRow } from "#manager/jobs";
import type { Question } from "#utility/types";

const formClass = cx("bg-base-100", "h-full", "p-9");

const jobTitleClass = cx(
	"font-normal",
	"leading-tight",
	"m-0",
	"p-3",
	"text-5xl",
);

const jobContainerClass = cx("flex", "items-center", "px-4");

const jobMetaLabelClass = cx("font-bold", "p-3", "whitespace-nowrap");

const jobMetaValueClass = cx("p-3", "text-base");

const postedByClass = cx(
	"flex",
	"items-center",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const sectionClass = cx(
	"bg-base-100",
	"border",
	"border-base-content",
	"gap-4",
	"grid",
	"p-4",
);

const sectionHeaderClass = cx(
	"border-b",
	"border-base-300",
	"flex",
	"items-center",
	"justify-between",
	"pb-3",
);

const sectionTitleClass = cx(
	"text-base-content/60",
	"text-label",
	"tracking-label",
	"uppercase",
);

const errorBannerClass = cx(
	"bg-error/10",
	"border",
	"border-error",
	"p-4",
	"text-error",
	"text-sm",
);

const emptyNoteClass = cx(
	"p-4",
	"text-base-content/50",
	"text-center",
	"text-sm",
);

const fieldRowClass = cx("gap-2", "grid", "py-3");

const fieldLabelClass = cx("font-medium", "text-sm");

const fieldClass = cx(
	"[font-family:inherit]",
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"p-3",
	"text-base",
	"text-inherit",
	"w-full",
);

const textareaFieldClass = cx("min-h-20", "resize-y");

const selectFieldClass = cx("cursor-pointer");

const fileFieldClass = cx("text-sm");

export const questionFieldName = (question: Question, index: number): string =>
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

export interface JobApplyProps {
	readonly job: JobWithCompanyRow;
	readonly questions: readonly Question[];
	readonly error?: string;
}

export const JobApply = ({ job, questions, error }: JobApplyProps) => (
	<Fragment>
		<form
			class={formClass}
			method="post"
			action={`/applicant/jobs/${job.id}/apply`}
			enctype="multipart/form-data"
		>
			<Col template="auto auto 1fr auto auto" gap="md">
				<div class={jobContainerClass}>
					<h1 class={jobTitleClass}>Apply</h1>
				</div>
				<Row gap="md">
					<div class={jobContainerClass}>
						<span class={jobMetaLabelClass}>Role</span>
						<span class={jobMetaValueClass}>{job.title}</span>
					</div>
					<div class={jobContainerClass}>
						<span class={jobMetaLabelClass}>Location</span>
						<span class={jobMetaValueClass}>{job.location ?? "—"}</span>
					</div>
					<div class={jobContainerClass}>
						<span class={jobMetaLabelClass}>Job Type</span>
						<span class={jobMetaValueClass}>{job.jobType ?? "—"}</span>
					</div>
				</Row>
				{error ? <div class={errorBannerClass}>{error}</div> : null}
				<div class={sectionClass}>
					<div class={sectionHeaderClass}>
						<span class={sectionTitleClass}>Resume</span>
					</div>
					<div class={fieldRowClass}>
						<label class={fieldLabelClass} for="resume">
							Resume *
						</label>
						<input
							id="resume"
							name="resume"
							type="file"
							accept=".pdf,.doc,.docx,.txt,.rtf"
							class={cx(fieldClass, fileFieldClass)}
							required
						/>
					</div>
				</div>
				<div class={sectionClass}>
					<div class={sectionHeaderClass}>
						<span class={sectionTitleClass}>Application Questions</span>
					</div>
					{questions.length === 0 ? (
						<div class={emptyNoteClass}>
							No custom questions for this role — your resume is enough.
						</div>
					) : (
						questions.map((question, index) => (
							<QuestionField question={question} index={index} />
						))
					)}
				</div>
				<Row template="1fr auto auto" gap="sm">
					<span class={postedByClass}>Posted by {job.companyName}</span>
					<Link variant="buttonBase" href={`/applicant/jobs/${job.id}`}>
						Back
					</Link>
					<Button type="submit" variant="contrast">
						Submit application
					</Button>
				</Row>
			</Col>
		</form>
	</Fragment>
);
