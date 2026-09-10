import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { html } from "hono/html";
import { type AppEnv, cx } from "#gateway/shared";

export const login = new Hono();

const loginMainClass = cx(
	"grid",
	"min-h-[100dvh]",
	"p-5",
	"place-items-center",
	"sm:p-8",
);

const loginCardClass = cx(
	"bg-base-100",
	"border",
	"border-base-content",
	"grid",
	"lg:grid-cols-[1.25fr_0.75fr]",
	"max-w-6xl",
	"w-full",
);

const loginCardHeaderClass = cx(
	"border-b",
	"border-base-content",
	"flex",
	"flex-col",
	"justify-between",
	"lg:border-b-0",
	"lg:border-r",
	"lg:min-h-[650px]",
	"min-h-96",
	"overflow-hidden",
	"p-6",
	"relative",
	"sm:p-10",
);

const loginSphereClass = cx(
	"absolute",
	"h-52",
	"right-[8%]",
	"rounded-full",
	"top-[17%]",
	"w-52",
);

const loginMetaRowClass = cx(
	"flex",
	"items-center",
	"justify-between",
	"text-label",
	"tracking-label",
	"uppercase",
);

const loginHeadingWrapClass = cx("relative", "z-10");

const loginHeadingClass = cx(
	"font-medium",
	"leading-[0.9]",
	"text-[clamp(3rem,6vw,5rem)]",
	"tracking-tighter",
);

const loginSubTextClass = cx(
	"max-w-[24rem]",
	"mt-8",
	"text-base-content/50",
	"text-sm",
);

const loginCardFooterClass = cx(
	"gap-4",
	"grid",
	"grid-cols-[auto_1fr_auto]",
	"items-center",
	"text-label",
	"tracking-rule",
	"uppercase",
);

const loginDividerClass = cx("bg-base-content/25", "h-px");

const loginFormClass = cx(
	"content-center",
	"gap-10",
	"grid",
	"lg:p-12",
	"p-6",
	"sm:p-10",
);

const loginTabsClass = cx(
	"border",
	"border-base-content",
	"grid",
	"grid-cols-2",
	"text-center",
	"text-label",
	"tracking-tab",
	"uppercase",
);

const loginTabActiveClass = cx("border-base-content", "border-r", "p-3");

const loginTabClass = cx("p-3");

const loginFieldClass = cx("gap-4", "grid");

const loginLabelClass = cx(
	"text-base-content/60",
	"text-label",
	"tracking-label",
	"uppercase",
);

const loginInputClass = cx(
	"bg-transparent",
	"border-b",
	"border-base-content",
	"focus:outline-none",
	"h-14",
	"p-0",
	"placeholder:text-base-content/50",
	"text-sm",
	"w-full",
);

const loginButtonClass = cx(
	"bg-neutral",
	"border-0",
	"cursor-pointer",
	"duration-150",
	"ease-out",
	"h-14",
	"hover:bg-neutral/85",
	"text-neutral-content",
	"text-xs",
	"tracking-button",
	"transition-colors",
	"uppercase",
	"w-full",
);

const loginNoteClass = cx(
	"text-base-content/35",
	"text-note",
	"tracking-note",
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

login.get("/", (c) => {
	return c.render(
		<main class={cx("bg-dot-fade", loginMainClass)}>
			<section class={loginCardClass}>
				<header class={loginCardHeaderClass}>
					<div
						aria-hidden="true"
						class={cx("bg-sphere shadow-sphere", loginSphereClass)}
					></div>
					<div class={loginMetaRowClass}>
						<span>System // Account</span>
						<span>90 / 106</span>
					</div>
					<div class={loginHeadingWrapClass}>
						<h1 class={loginHeadingClass}>
							Welcome
							<br />
							back
						</h1>
						<p class={loginSubTextClass}>Sign in to your account</p>
					</div>
					<div class={loginCardFooterClass}>
						<span>Slop Free</span>
						<span class={loginDividerClass}></span>
						<span>Network</span>
					</div>
				</header>

				<form
					data-signals:fetching="false"
					data-on:submit="@post('/login', {contentType: 'form'})"
					data-indicator:fetching=""
					class={loginFormClass}
				>
					<div id="message"></div>
					<div class={loginTabsClass}>
						<span class={loginTabActiveClass}>Account</span>
						<span class={loginTabClass}>Secure</span>
					</div>
					<div class={loginFieldClass}>
						<label class={loginLabelClass} for="email">
							Email
						</label>
						<input
							class={loginInputClass}
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							autocomplete="email"
							required
						/>
					</div>
					<div class={loginFieldClass}>
						<label class={loginLabelClass} for="pass">
							Password
						</label>
						<input
							class={loginInputClass}
							id="pass"
							name="pass"
							type="password"
							placeholder="••••••••••••"
							autocomplete="current-password"
							required
						/>
					</div>
					<button
						class={loginButtonClass}
						type="submit"
						data-attr:disabled="$fetching"
					>
						<span data-text="$fetching ? 'Processing...' : 'Continue'">
							Continue
						</span>
					</button>
					<p class={loginNoteClass}>Applicant / Recruiter</p>
				</form>
			</section>
		</main>,
	);
});

login.post("/", async (c: Context<AppEnv>) => {
	const body = await c.req.parseBody();
	const email = body.email as string;
	const pass = body.pass as string;

	const user = await c.env.db
		.prepare(
			"SELECT id, password_hash, email_verified FROM users WHERE email = ?1",
		)
		.bind(email)
		.first();

	const err = async (msg: string) => {
		const element =
			await html`<div data-tone="error" class="${toneClasses.error}">${msg}</div>`;
		return ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(element, { selector: "#message", mode: "inner" });
		});
	};

	if (!user) return err("Invalid email or password.");

	const encoder = new TextEncoder();
	const hashBuffer = await crypto.subtle.digest(
		"SHA-256",
		encoder.encode(pass),
	);
	const hashHex = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	if (user.password_hash !== hashHex) return err("Invalid email or password.");
	if (user.email_verified === 0) {
		const element = await html`
                        <div data-tone="warning" class="${toneClasses.warning}">
        Please verify your email first.
      </div>
    `;
		return ServerSentEventGenerator.stream((stream) => {
			stream.patchElements(element, { selector: "#message", mode: "inner" });
		});
	}

	const secret = String(
		c.env.SESSION_SECRET || "dev-fallback-secret-key-change-in-prod",
	);

	await setSignedCookie(c, "session", String(user.id), secret, {
		httpOnly: true,
		sameSite: "Lax",
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
	});

	const successElement = await html`
                <div data-tone="success" class="${toneClasses.success}">
      Login successful. Redirecting...
    </div>
  `;

	const sseResponse = ServerSentEventGenerator.stream((stream) => {
		stream.patchElements(successElement, {
			selector: "#message",
			mode: "inner",
		});
		stream.executeScript('window.location.href = "/"');
	});

	const cookieHeader = c.res.headers.get("set-cookie");
	if (cookieHeader) {
		sseResponse.headers.append("set-cookie", cookieHeader);
	}

	return sseResponse;
});
