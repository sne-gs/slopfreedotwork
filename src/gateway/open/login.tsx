import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type Context, Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { css, cx } from "hono/css";
import { html } from "hono/html";
import type { AppEnv } from "#gateway/shared";

export const login = new Hono();

const loginMainClass = css`
    display: grid;
    min-height: 100dvh;
    place-items: center;
    padding: var(--space-5);
    @media (min-width: 640px) {
        padding: var(--space-8);
    }
`;

const loginCardClass = css`
    display: grid;
    width: 100%;
    max-width: 72rem;
    border: var(--line-width-default) solid var(--color-base-content);
    background-color: var(--color-base-100);
    @media (min-width: 1024px) {
        grid-template-columns: 1.25fr 0.75fr;
    }
`;

const loginCardHeaderClass = css`
    position: relative;
    display: flex;
    min-height: 24rem;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    border-bottom: var(--line-width-default) solid var(--color-base-content);
    padding: var(--space-6);
    @media (min-width: 640px) {
        padding: var(--space-10);
    }
    @media (min-width: 1024px) {
        min-height: 650px;
        border-bottom: 0;
        border-right: var(--line-width-default) solid var(--color-base-content);
    }
`;

const loginSphereClass = css`
    position: absolute;
    right: 8%;
    top: 17%;
    width: 13rem;
    height: 13rem;
    border-radius: var(--radius-full);
`;

const loginMetaRowClass = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
`;

const loginHeadingWrapClass = css`
    position: relative;
    z-index: 10;
`;

const loginHeadingClass = css`
    font-size: clamp(var(--text-5xl), 6vw, var(--space-20));
    font-weight: var(--weight-medium);
    line-height: 0.9;
    letter-spacing: var(--tracking-tighter);
`;

const loginSubTextClass = css`
    margin-top: var(--space-8);
    max-width: 24rem;
    font-size: var(--text-sm);
    color: var(--color-content-faint);
`;

const loginCardFooterClass = css`
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-rule);
`;

const loginDividerClass = css`
    height: var(--line-width-default);
    background-color: color-mix(in oklab, var(--color-base-content) 25%, transparent);
`;

const loginFormClass = css`
    display: grid;
    align-content: center;
    gap: var(--space-10);
    padding: var(--space-6);
    @media (min-width: 640px) {
        padding: var(--space-10);
    }
    @media (min-width: 1024px) {
        padding: var(--space-12);
    }
`;

const loginTabsClass = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: var(--line-width-default) solid var(--color-base-content);
    text-align: center;
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tab);
`;

const loginTabActiveClass = css`
    border-right: var(--line-width-default) solid var(--color-base-content);
    padding: var(--space-3);
`;

const loginTabClass = css`
    padding: var(--space-3);
`;

const loginFieldClass = css`
    display: grid;
    gap: var(--space-4);
`;

const loginLabelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-muted);
`;

const loginInputClass = css`
    height: var(--space-14);
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

const loginButtonClass = css`
    height: var(--space-14);
    width: 100%;
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

const loginNoteClass = css`
    font-size: var(--text-note);
    text-transform: uppercase;
    letter-spacing: var(--tracking-note);
    color: color-mix(in oklab, var(--color-base-content) 35%, transparent);
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
					<div id="message" class={messageWrapperClass}></div>
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

	const user = await c.env.slopfreeworkdb
		.prepare(
			"SELECT id, password_hash, email_verified FROM users WHERE email = ?1",
		)
		.bind(email)
		.first();

	const err = async (msg: string) => {
		const element = await html`<div data-tone="error">${msg}</div>`;
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
			<div data-tone="warning">
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
		<div data-tone="success">
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
