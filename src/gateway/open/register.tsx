import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { css, cx } from "hono/css";
import { html } from "hono/html";
import { Resend } from "resend";
import { type AppEnv, Footer, Nav } from "#gateway/shared";

export const register = new Hono();

const registerPageClass = css`
    display: flex;
    min-height: 100dvh;
    flex-direction: column;
    background-color: var(--color-base-300);
    gap: 1px;
`;

const registerHeroClass = css`
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding-block: var(--space-16);
    }
`;

const registerKickerClass = css`
    display: block;
    margin-bottom: var(--space-6);
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-faint);
`;

const registerHeadingClass = css`
    max-width: 48rem;
    font-size: var(--text-5xl);
    font-weight: var(--weight-medium);
    line-height: 0.85;
    letter-spacing: -0.06em;
    @media (min-width: 768px) {
        font-size: 6rem;
    }
`;

const registerLayoutClass = css`
    background-color: var(--color-base-100);
    display: grid;
    flex-grow: 1;
    @media (min-width: 1024px) {
        grid-template-columns: 1fr 1.5fr;
    }
`;

const registerAsideClass = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: var(--line-width-default) solid var(--color-base-300);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
    @media (min-width: 1024px) {
        border-bottom: 0;
        border-right: var(--line-width-default) solid var(--color-base-300);
    }
`;

const registerRoleToggleClass = css`
    display: grid;
    width: 100%;
    border: var(--line-width-default) solid var(--color-base-300);
`;

const roleButtonClass = css`
    width: 100%;
    border: 0;
    padding: var(--space-4);
    text-align: left;
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: var(--color-base-200);
    }
    &[aria-pressed="true"] {
        background-color: var(--color-neutral);
        color: var(--color-neutral-content);
    }
`;

const roleButtonDividerClass = css`
    border-bottom: var(--line-width-default) solid var(--color-base-300);
`;

const registerLegalClass = css`
    margin-top: var(--space-12);
    max-width: 20rem;
    font-size: var(--text-xs);
    line-height: var(--leading-relaxed);
    color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
`;

const registerContentClass = css`
    display: flex;
    align-items: center;
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
`;

const registerFormClass = css`
    display: grid;
    gap: var(--space-10);
    width: 100%;
    max-width: 36rem;
`;

const registerNameRowClass = css`
    display: grid;
    gap: var(--space-10);
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const registerFieldClass = css`
    display: grid;
    gap: var(--space-2);
`;

const registerLabelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-muted);
`;

const registerInputClass = css`
    height: var(--space-12);
    width: 100%;
    border: 0;
    border-bottom: var(--line-width-default) solid var(--color-base-content);
    background-color: transparent;
    padding: 0;
    font-size: var(--text-sm);
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: var(--color-content-faint);
    }
`;

const registerTermsRowClass = css`
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-block: var(--space-4);
`;

const registerCheckboxClass = css`
    width: var(--space-4);
    height: var(--space-4);
    border: var(--line-width-default) solid var(--color-base-content);
    accent-color: var(--color-neutral);
    cursor: pointer;
`;

const registerTermsLabelClass = css`
    font-size: var(--text-xs);
    color: var(--color-content-muted);
    cursor: pointer;
`;

const registerTermsLinkClass = css`
    text-decoration: underline;
    text-underline-offset: 4px;
    &:hover {
        color: var(--color-base-content);
    }
`;

const registerSubmitRowClass = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: var(--line-width-default) solid var(--color-base-300);
    padding-top: var(--space-6);
`;

const registerStatusClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
`;

const registerSubmitClass = css`
    height: var(--space-12);
    padding-inline: var(--space-10);
    cursor: pointer;
    border: 0;
    background-color: var(--color-neutral);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: var(--color-neutral-content);
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
    }
`;

const verifyPageClass = css`
    display: grid;
    min-height: 100dvh;
    place-items: center;
    padding: var(--space-5);
    background-color: var(--color-base-100);
`;

const verifyWrapClass = css`
    text-align: center;
`;

const verifyTitleClass = css`
    margin-bottom: var(--space-4);
    font-size: var(--text-4xl);
    font-weight: var(--weight-medium);
`;

const verifyBodyClass = css`
    margin-bottom: var(--space-6);
    color: var(--color-content-faint);
`;

const verifyActionClass = css`
    display: inline-flex;
    align-items: center;
    height: var(--space-12);
    padding-inline: var(--space-10);
    border: 0;
    background-color: var(--color-neutral);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
    color: var(--color-neutral-content);
    text-decoration: none;
    transition: background-color var(--duration-fast) var(--ease-out);
    &:hover {
        background-color: color-mix(in oklab, var(--color-neutral) 85%, transparent);
    }
`;

const messageWrapperClass = css`
    & > [data-tone="error"] {
        padding: var(--space-4);
        border: var(--line-width-default) solid var(--color-error);
        background-color: color-mix(in oklab, var(--color-error) 10%, transparent);
        color: var(--color-error);
        font-size: var(--text-sm);
    }
    & > [data-tone="warning"] {
        padding: var(--space-4);
        border: var(--line-width-default) solid var(--color-warning);
        background-color: color-mix(in oklab, var(--color-warning) 10%, transparent);
        color: var(--color-warning);
        font-size: var(--text-sm);
    }
    & > [data-tone="success"] {
        padding: var(--space-4);
        border: var(--line-width-default) solid var(--color-success);
        background-color: color-mix(in oklab, var(--color-success) 10%, transparent);
        color: var(--color-success);
        font-size: var(--text-sm);
    }
`;

register.get("/", (c) => {
	return c.render(
		<div class={registerPageClass}>
			<Nav user={null} />
			<header class={cx("bg-dot-fade", registerHeroClass)}>
				<span class={registerKickerClass}>System // Registration Protocol</span>
				<h1 class={registerHeadingClass}>
					Initialize
					<br />
					your profile.
				</h1>
			</header>

			<main class={registerLayoutClass}>
				<aside class={registerAsideClass}>
					<div>
						<span class={registerKickerClass}>Access Level</span>
						<div class={registerRoleToggleClass}>
							<button
								type="button"
								data-on:click="$role = 'recruiter'"
								data-attr:aria-pressed="$role === 'recruiter' ? 'true' : 'false'"
								class={cx(roleButtonClass, roleButtonDividerClass)}
							>
								Recruiter
							</button>
							<button
								type="button"
								data-on:click="$role = 'applicant'"
								data-attr:aria-pressed="$role === 'applicant' ? 'true' : 'false'"
								class={roleButtonClass}
							>
								Applicant
							</button>
						</div>
					</div>
					<p class={registerLegalClass}>
						By initializing a profile, you agree to the system terms and data
						processing protocols.
					</p>
				</aside>
				<section class={registerContentClass}>
					<form
						data-signals:role="'applicant'"
						data-on:submit="@post('/register', {contentType: 'form'})"
						data-indicator:fetching=""
						class={registerFormClass}
					>
						<input type="hidden" name="role" data-attr:value="$role" />
						<div id="message" class={messageWrapperClass}></div>

						<div class={registerNameRowClass}>
							<div class={registerFieldClass}>
								<label class={registerLabelClass} for="fname">
									First Name
								</label>
								<input
									class={registerInputClass}
									id="fname"
									name="fname"
									type="text"
									placeholder="Jane"
									required
								/>
							</div>
							<div class={registerFieldClass}>
								<label class={registerLabelClass} for="lname">
									Last Name
								</label>
								<input
									class={registerInputClass}
									id="lname"
									name="lname"
									type="text"
									placeholder="Doe"
									required
								/>
							</div>
						</div>

						<div class={registerFieldClass}>
							<label class={registerLabelClass} for="email">
								Corporate Email
							</label>
							<input
								class={registerInputClass}
								id="email"
								name="email"
								type="email"
								placeholder="jane@company.com"
								required
							/>
						</div>

						<div class={registerFieldClass}>
							<label class={registerLabelClass} for="pass">
								Password
							</label>
							<input
								class={registerInputClass}
								id="pass"
								name="pass"
								type="password"
								placeholder="••••••••••••"
								required
							/>
						</div>

						<input type="hidden" name="role" value="applicant" />

						<div class={registerTermsRowClass}>
							<input
								type="checkbox"
								class={registerCheckboxClass}
								id="terms"
								name="terms"
								required
							/>
							<label for="terms" class={registerTermsLabelClass}>
								I accept the{" "}
								<a href="/terms-of-service" class={registerTermsLinkClass}>
									data protocols
								</a>
								.
							</label>
						</div>

						<div class={registerSubmitRowClass}>
							<span
								class={registerStatusClass}
								data-text="$fetching ? 'Processing...' : 'Status: Ready'"
							>
								Status: Ready
							</span>
							<button
								type="submit"
								class={registerSubmitClass}
								data-attr:disabled="$fetching"
							>
								Initialize
							</button>
						</div>
					</form>
				</section>
			</main>

			<Footer />
		</div>,
	);
});

register.get("/verify", async (c: Context<AppEnv>) => {
	const token = c.req.query("token");

	if (!token) {
		return c.render(
			<main class={verifyPageClass}>
				<div class={messageWrapperClass}>
					<div data-tone="error">Invalid or missing verification token.</div>
				</div>
			</main>,
		);
	}

	const user = await c.env.slopfreeworkdb
		.prepare(
			"SELECT id, email_verified FROM users WHERE verification_token = ?1",
		)
		.bind(token)
		.first();

	if (!user) {
		return c.render(
			<main class={verifyPageClass}>
				<div class={verifyWrapClass}>
					<h1 class={verifyTitleClass}>Invalid Link</h1>
					<p class={verifyBodyClass}>
						This verification link is invalid or has expired.
					</p>
					<a href="/login" class={verifyActionClass}>
						Return to Sign In
					</a>
				</div>
			</main>,
		);
	}

	if (user.email_verified === 1) {
		return c.render(
			<main class={verifyPageClass}>
				<div class={verifyWrapClass}>
					<h1 class={verifyTitleClass}>Already Verified</h1>
					<p class={verifyBodyClass}>Your email is already verified.</p>
					<a href="/login" class={verifyActionClass}>
						Sign In
					</a>
				</div>
			</main>,
		);
	}

	await c.env.slopfreeworkdb
		.prepare(
			"UPDATE users SET email_verified = 1, verification_token = NULL WHERE verification_token = ?1",
		)
		.bind(token)
		.run();

	return c.render(
		<main class={verifyPageClass}>
			<div class={verifyWrapClass}>
				<h1 class={verifyTitleClass}>Verification Successful</h1>
				<p class={verifyBodyClass}>Your account has been activated.</p>
				<a href="/login" class={verifyActionClass}>
					Sign In
				</a>
			</div>
		</main>,
	);
});

register.post("/", async (c: Context<AppEnv>) => {
	const body = await c.req.parseBody();
	const email = body.email as string;
	const pass = body.pass as string;
	const role = (body.role as string) || "applicant";

	const existing = await c.env.slopfreeworkdb
		.prepare("SELECT id FROM users WHERE email = ?1")
		.bind(email)
		.first();

	const err = (msg: string) =>
		ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(String(html`<div data-tone="error">${msg}</div>`), {
				selector: "#message",
				mode: "inner",
			});
		});

	if (existing) {
		return err("Email already registered.");
	}

	const encoder = new TextEncoder();
	const data = encoder.encode(pass);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	const token = crypto.randomUUID();

	await c.env.slopfreeworkdb
		.prepare(
			"INSERT INTO users (email, password_hash, role, verification_token, email_verified) VALUES (?1, ?2, ?3, ?4, ?5)",
		)
		.bind(email, hashHex, role, token, 0)
		.run();

	const baseUrl = c.env.BASE_URL || new URL(c.req.url).origin;
	const verifyUrl = `${baseUrl}/register/verify?token=${token}`;

	const resend = new Resend(c.env.RESEND_API_KEY);
	await resend.emails.send({
		from: "SlopFree Work <onboarding@resend.dev>",
		to: email,
		subject: "Verify your email",
		html: `<p>Click here to verify your account: <a href="${verifyUrl}">Verify Account</a></p>`,
	});

	return ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(
			String(
				html`<div data-tone="success">
					Registration successful. Check email for verification.
				</div>`,
			),
			{ selector: "#message", mode: "inner" },
		);
	});
});
