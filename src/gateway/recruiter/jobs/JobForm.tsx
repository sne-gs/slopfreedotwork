import type { FC } from "hono/jsx";
import { Fragment } from "hono/jsx/jsx-runtime";
import {
	Button,
	Col,
	cx,
	Footer,
	Link,
	Main,
	MarkdownInput,
	Nav,
	Row,
	TextInput,
} from "#gateway/shared";
import type { Question, User } from "#utility/types";
import { QuestionEditor } from "./QuestionEditor";

const formClass = cx("bg-base-100", "h-full", "p-9");

const saveStatusClass = cx(
	"flex",
	"items-center",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const jobTitleInputClass = cx("!text-5xl");

const jobInputContainerClass = cx("flex", "items-center", "px-4");

const jobInputClass = cx("border-none");

const discardBtnClass = cx(
	"bg-transparent",
	"border",
	"border-error",
	"cursor-pointer",
	"hover:bg-error/10",
	"inline-flex",
	"items-center",
	"justify-center",
	"h-10",
	"px-6",
	"text-error",
	"text-xs",
	"tracking-button",
	"uppercase",
);

const autosave = (draftEndpoint: string) => ({
	"data-on:input__debounce.750ms": `@post('${draftEndpoint}', {contentType: 'form'})`,
	"data-on:change__debounce.750ms": `@post('${draftEndpoint}', {contentType: 'form'})`,
	"data-on:submit": `@post('${draftEndpoint}', {contentType: 'form'})`,
});

export interface JobFormProps {
	readonly user: User | null;
	readonly title: string;
	readonly location: string;
	readonly jobType: string;
	readonly description: string;
	readonly questions: readonly Question[];
	readonly draftEndpoint: string;
	readonly questionsEndpoint: string;
	readonly publishEndpoint: string;
	readonly statusText: string;
	readonly cancelHref: string;
	readonly mode: "draft" | "linkedDraft";
	readonly discardEndpoint?: string;
}

export const JobForm: FC<JobFormProps> = ({
	user,
	title,
	location,
	jobType,
	description,
	questions,
	draftEndpoint,
	questionsEndpoint,
	publishEndpoint,
	statusText,
	cancelHref,
	mode,
	discardEndpoint,
}) => (
	<Fragment>
		<Nav user={user} />
		<Main>
			<form class={formClass} noValidate {...autosave(draftEndpoint)}>
				<Col template="auto auto 1fr auto auto" gap="md">
					<TextInput
						name="jobTitle"
						isRequired
						value={title}
						inputClass={cx(jobInputClass, jobTitleInputClass)}
						placeholder="Job title"
					/>
					<Row gap="md">
						<TextInput
							inputClass={jobInputClass}
							inputContainerClass={jobInputContainerClass}
							name="jobLocation"
							label="Location"
							isRequired
							value={location}
							placeholder="Job location"
						/>
						<TextInput
							inputClass={jobInputClass}
							inputContainerClass={jobInputContainerClass}
							name="jobType"
							label="Job Type"
							isRequired
							value={jobType}
							placeholder="Job type (full-time, part-time, contract, etc)"
						/>
					</Row>
					<MarkdownInput
						name="jobDescription"
						placeholder="Enter the job description here (accepts markdown)"
						content={description}
					/>
					<QuestionEditor
						questions={questions}
						questionsEndpoint={questionsEndpoint}
					/>
					<Row
						template={discardEndpoint ? "1fr auto auto auto" : "1fr auto auto"}
						gap="sm"
					>
						<span id="save-status" class={saveStatusClass}>
							{statusText}
						</span>
						<Link variant="buttonBase" href={cancelHref}>
							Cancel
						</Link>
						{discardEndpoint && (
							<button
								type="button"
								class={discardBtnClass}
								data-on:click={`@post('${discardEndpoint}', {contentType: 'form'})`}
							>
								Discard draft
							</button>
						)}
						<Button
							type="button"
							variant="contrast"
							data-on:click={`@post('${publishEndpoint}', {contentType: 'form'})`}
						>
							{mode === "linkedDraft" ? "Publish changes" : "Publish"}
						</Button>
					</Row>
				</Col>
			</form>
		</Main>
		<Footer />
	</Fragment>
);
