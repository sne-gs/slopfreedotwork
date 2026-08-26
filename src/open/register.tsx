import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { html } from "hono/html";
import { Resend } from "resend";
import { type AppEnv, Footer, Nav } from "../shared";

export const register = new Hono();

register.get("/", (c) => {
	return c.render(
		<div class="min-h-screen flex flex-col bg-base-100 text-base-content font-sans">
			<Nav user={null} />
			<header class="px-6 py-10 md:py-16 border-b border-solid border-base-300 bg-dot-fade">
				<span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/50 block mb-6">
					System // Registration Protocol
				</span>
				<h1 class="text-5xl md:text-8xl font-medium leading-[0.85] tracking-[-0.06em] max-w-3xl">
					Initialize
					<br />
					your profile.
				</h1>
			</header>

			<main class="grid lg:grid-cols-[1fr_1.5fr] flex-grow">
				<aside class="border-b border-solid lg:border-b-0 lg:border-r border-solid border-base-300 p-6 md:p-12 flex flex-col justify-between">
					<div>
						<span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/50 block mb-6">
							Access Level
						</span>
						<div class="grid w-full border border-solid border-base-300">
							<button
								type="button"
								data-on:click="$role = 'recruiter'"
								data-class:bg-neutral="$role === 'recruiter'"
								data-class:text-neutral-content="$role === 'recruiter'"
								class="w-full text-left border-0 border-b border-solid border-base-300 p-4 text-sm case-upper tracking-[0.25em] transition-colors hover:bg-base-200"
							>
								Recruiter
							</button>
							<button
								type="button"
								data-on:click="$role = 'applicant'"
								data-class:bg-neutral="$role === 'applicant'"
								data-class:text-neutral-content="$role === 'applicant'"
								class="w-full text-left border-0 p-4 text-sm case-upper tracking-[0.25em] transition-colors hover:bg-base-200"
							>
								Applicant
							</button>
						</div>
					</div>
					<p class="text-xs text-base-content/40 mt-12 max-w-xs leading-relaxed">
						By initializing a profile, you agree to the system terms and data
						processing protocols.
					</p>
				</aside>
				<section class="p-6 md:p-12 flex items-center">
					<form
						data-signals:role="'applicant'"
						data-on:submit="@post('/register', {contentType: 'form'})"
						data-indicator:fetching
						class="grid gap-10 w-full max-w-xl"
					>
						<input type="hidden" name="role" data-attr:value="$role" />
						<div id="message"></div>

						<div class="grid md:grid-cols-2 gap-10">
							<div class="grid gap-2">
								<label
									class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60"
									for="fname"
								>
									First Name
								</label>
								<input
									class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
									id="fname"
									name="fname"
									type="text"
									placeholder="Jane"
									required
								/>
							</div>
							<div class="grid gap-2">
								<label
									class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60"
									for="lname"
								>
									Last Name
								</label>
								<input
									class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
									id="lname"
									name="lname"
									type="text"
									placeholder="Doe"
									required
								/>
							</div>
						</div>

						<div class="grid gap-2">
							<label
								class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60"
								for="email"
							>
								Corporate Email
							</label>
							<input
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
								id="email"
								name="email"
								type="email"
								placeholder="jane@company.com"
								required
							/>
						</div>

						<div class="grid gap-2">
							<label
								class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60"
								for="pass"
							>
								Password
							</label>
							<input
								class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
								id="pass"
								name="pass"
								type="password"
								placeholder="••••••••••••"
								required
							/>
						</div>

						<input type="hidden" name="role" value="applicant" />

						<div class="flex items-center gap-4 my-4">
							<input
								type="checkbox"
								class="size-4 border border-solid border-base-content accent-neutral cursor-pointer"
								id="terms"
								name="terms"
								required
							/>
							<label
								for="terms"
								class="text-xs text-base-content/60 cursor-pointer"
							>
								I accept the{" "}
								<a
									href="/terms-of-service"
									class="underline underline-offset-4 hover:text-base-content"
								>
									data protocols
								</a>
								.
							</label>
						</div>

						<div class="pt-6 border-t border-solid border-base-300 flex items-center justify-between">
							<span
								class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/40"
								data-text="$fetching ? 'Processing...' : 'Status: Ready'"
							>
								Status: Ready
							</span>
							<button
								type="submit"
								class="h-12 px-10 cursor-pointer border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85"
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
			<main class="grid min-h-screen place-items-center bg-base-100 p-5 font-sans text-base-content">
				<div class="p-4 border border-solid border-error bg-error/10 text-error text-sm">
					Invalid or missing verification token.
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
			<main class="grid min-h-screen place-items-center bg-base-100 p-5 font-sans text-base-content">
				<div class="text-center">
					<h1 class="text-4xl font-medium mb-4">Invalid Link</h1>
					<p class="text-base-content/50 mb-6">
						This verification link is invalid or has expired.
					</p>
					<a
						href="/login"
						class="h-12 px-10 inline-flex items-center border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85"
					>
						Return to Sign In
					</a>
				</div>
			</main>,
		);
	}

	if (user.email_verified === 1) {
		return c.render(
			<main class="grid min-h-screen place-items-center bg-base-100 p-5 font-sans text-base-content">
				<div class="text-center">
					<h1 class="text-4xl font-medium mb-4">Already Verified</h1>
					<p class="text-base-content/50 mb-6">
						Your email is already verified.
					</p>
					<a
						href="/login"
						class="h-12 px-10 inline-flex items-center border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85"
					>
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
		<main class="grid min-h-screen place-items-center bg-base-100 p-5 font-sans text-base-content">
			<div class="text-center">
				<h1 class="text-4xl font-medium mb-4">Verification Successful</h1>
				<p class="text-base-content/50 mb-6">
					Your account has been activated.
				</p>
				<a
					href="/login"
					class="h-12 px-10 inline-flex items-center border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85"
				>
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

	if (existing) {
		return ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(
				String(
					html`<div
            class="p-4 border border-solid border-error bg-error/10 text-error text-sm"
          >
            Email already registered.
          </div>`,
				),
				{ selector: "#message", mode: "inner" },
			);
		});
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
				html`<div
          class="p-4 border border-solid border-success bg-success/10 text-success text-sm"
        >
          Registration successful. Check email for verification.
        </div>`,
			),
			{ selector: "#message", mode: "inner" },
		);
	});
});
