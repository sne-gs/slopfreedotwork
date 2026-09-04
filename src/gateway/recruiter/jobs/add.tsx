import { type Context, Hono } from "hono";
import { css, cx } from "hono/css";
import { Fragment } from "hono/jsx/jsx-runtime";
import {
	type AppEnv,
	Button,
	Col,
	Footer,
	Main,
	MarkdownInput,
	Nav,
	Row,
	TextInput,
} from "#gateway/shared";
import { QuestionEditor } from "./QuestionEditor";

export const add = new Hono();

const jobTitleInputClass = css`
	font-size: var(--text-5xl);
`;

const jobInputContainerClass = css`
	display: flex;
	align-items: center;
	padding-inline: var(--spacing-default);
`;

const jobInputClass = css`
	border: 0;
`;

const formClass = css`
	height: 100%;
	background-color: var(--color-base-100);
	padding: var(--spacing-4xl);
`;

add.get("/", (c: Context<AppEnv>) => {
	return c.render(
		<Fragment>
			<Nav user={c.get("user")} />
			<Main>
				<form
					class={formClass}
					data-on:submit="@post('/recruiter/jobs/add', {contentType: 'form'})"
				>
					<Col template="auto auto 1fr auto auto" gap="md">
						<TextInput
							name="jobTitle"
							isRequired
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
								placeholder="Job location"
							/>
							<TextInput
								inputClass={jobInputClass}
								inputContainerClass={jobInputContainerClass}
								name="jobType"
								label="Job Type"
								isRequired
								placeholder="Job type (full-time, part-time, contract, etc)"
							/>
						</Row>
						<MarkdownInput
							name="jobDescription"
							placeholder="Enter the job description here (accepts markdown)"
						/>
						<QuestionEditor name="customFormSchema" />
						<Row gap="sm" justify="end" template="auto">
							<Button variant="secondary">Cancel</Button>
							<Button type="submit">Save</Button>
						</Row>
					</Col>
				</form>
			</Main>
			<Footer />
		</Fragment>,
	);
});

add.post("/", async (c: Context<AppEnv>) => {
	const body = await c.req.parseBody();
	const title = body.jobTitle as string;
	const location = body.jobLocation as string;
	const jobType = body.jobType as string;
	const description = body.jobDescription as string;
	const customFormSchema = body.customFormSchema as string | undefined;

	const user = c.get("user");
	if (!user) return c.redirect("/login");

	const company = await c.env.slopfreeworkdb
		.prepare("SELECT id FROM companies WHERE owner_id = ?1")
		.bind(user.id)
		.first<{ id: number }>();

	if (!company) {
		return c.json({ error: "No company found for user" }, 400);
	}

	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	await c.env.slopfreeworkdb
		.prepare(
			"INSERT INTO jobs (company_id, title, slug, description, location, job_type, custom_form_schema, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'active')",
		)
		.bind(
			company.id,
			title,
			slug,
			description,
			location,
			jobType,
			customFormSchema || null,
		)
		.run();

	return c.redirect("/recruiter/jobs");
});
