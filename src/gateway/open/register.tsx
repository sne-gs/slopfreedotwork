import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { html } from "hono/html";
import { Resend } from "resend";
import { type AppEnv, cx, Footer, Nav } from "#gateway/shared";

export const register = new Hono();

const registerPageClass = cx(
	"bg-base-300",
	"flex",
	"flex-col",
	"gap-px",
	"min-h-[100dvh]",
);

const registerHeroClass = cx("md:py-16", "p-10", "px-6");

const registerKickerClass = cx(
	"block",
	"mb-6",
	"text-base-content/50",
	"text-label",
	"tracking-label",
	"uppercase",
);

const registerHeadingClass = cx(
	"font-medium",
	"leading-[0.85]",
	"max-w-3xl",
	"md:text-6xl",
	"text-5xl",
	"tracking-[-0.06em]",
);

const registerLayoutClass = cx(
	"bg-base-100",
	"grid",
	"grow",
	"lg:grid-cols-[1fr_1.5fr]",
);

const registerAsideClass = cx(
	"border-b",
	"border-base-300",
	"flex",
	"flex-col",
	"justify-between",
	"lg:border-b-0",
	"lg:border-r",
	"md:p-12",
	"p-6",
);

const registerRoleToggleClass = cx(
	"border",
	"border-base-300",
	"grid",
	"w-full",
);

const roleButtonClass = cx(
	"[&[aria-pressed=true]]:bg-neutral",
	"[&[aria-pressed=true]]:text-neutral-content",
	"border-0",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"hover:bg-base-200",
	"p-4",
	"text-left",
	"text-sm",
	"tracking-label",
	"transition-colors",
	"uppercase",
	"w-full",
);

const roleButtonDividerClass = cx("border-b", "border-base-300");

const registerLegalClass = cx(
	"leading-relaxed",
	"max-w-[20rem]",
	"mt-12",
	"text-base-content/40",
	"text-xs",
);

const registerContentClass = cx("flex", "items-center", "md:p-12", "p-6");

const registerFormClass = cx("gap-10", "grid", "max-w-xl", "w-full");

const registerNameRowClass = cx("gap-10", "grid", "md:grid-cols-2");

const registerFieldClass = cx("gap-2", "grid");

const registerLabelClass = cx(
	"text-base-content/60",
	"text-label",
	"tracking-label",
	"uppercase",
);

const registerInputClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"h-12",
	"p-0",
	"placeholder:text-base-content/50",
	"text-sm",
	"w-full",
);

const registerTermsRowClass = cx("flex", "gap-4", "items-center", "my-4");

const registerCheckboxClass = cx(
	"accent-neutral",
	"border",
	"border-base-content",
	"cursor-pointer",
	"h-4",
	"w-4",
);

const registerTermsLabelClass = cx(
	"cursor-pointer",
	"text-base-content/60",
	"text-xs",
);

const registerTermsLinkClass = cx(
	"hover:text-base-content",
	"underline",
	"underline-offset-4",
);

const registerSubmitRowClass = cx(
	"border-base-300",
	"border-t",
	"flex",
	"items-center",
	"justify-between",
	"pt-6",
);

const registerStatusClass = cx(
	"text-base-content/40",
	"text-label",
	"tracking-label",
	"uppercase",
);

const registerSubmitClass = cx(
	"bg-neutral",
	"border-0",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"h-12",
	"hover:bg-neutral/85",
	"px-10",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

const verifyPageClass = cx(
	"bg-base-100",
	"grid",
	"min-h-[100dvh]",
	"p-5",
	"place-items-center",
);

const verifyWrapClass = cx("text-center");

const verifyTitleClass = cx("font-medium", "mb-4", "text-4xl");

const verifyBodyClass = cx("mb-6", "text-base-content/50");

const verifyActionClass = cx(
	"bg-neutral",
	"border-0",
	"duration-150",
	"ease-out",
	"h-12",
	"hover:bg-neutral/85",
	"inline-flex",
	"items-center",
	"no-underline",
	"px-10",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
);

const toneClasses: Record<string, string> = {
	error: cx(
		"bg-error/10",
		"border",
		"border-error",
		"p-4",
		"text-error",
		"text-sm",
	),
	warning: cx(
		"bg-warning/10",
		"border",
		"border-warning",
		"p-4",
		"text-warning",
		"text-sm",
	),
	success: cx(
		"bg-success/10",
		"border",
		"border-success",
		"p-4",
		"text-success",
		"text-sm",
	),
};

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
						<div id="message"></div>

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
				<div id="message">
					<div data-tone="error" class={toneClasses.error}>
						Invalid or missing verification token.
					</div>
				</div>
			</main>,
		);
	}

	const user = await c.env.db
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

	await c.env.db
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

	const existing = await c.env.db
		.prepare("SELECT id FROM users WHERE email = ?1")
		.bind(email)
		.first();

	const err = (msg: string) =>
		ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(
				String(
					html`<div data-tone="error" class="${toneClasses.error}">${msg}</div>`,
				),
				{
					selector: "#message",
					mode: "inner",
				},
			);
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

	await c.env.db
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
				html`<div data-tone="success" class="${toneClasses.success}">
                                        Registration successful. Check email for verification.
                                </div>`,
			),
			{ selector: "#message", mode: "inner" },
		);
	});
});
