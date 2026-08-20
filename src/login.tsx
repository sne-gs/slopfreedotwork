import { Hono } from "hono";
import { html } from "hono/html";
import { setSignedCookie } from "hono/cookie";
import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";

const login = new Hono();

login.get("/", (c) => {
  return c.render(
    <main class="grid min-h-screen place-items-center bg-base-100 p-5 font-sans text-base-content sm:p-8 bg-dot-fade">
      <section class="grid w-full max-w-6xl border border-solid border-base-content lg:grid-cols-[1.25fr_0.75fr] bg-base-100">
        <header class="relative flex min-h-96 flex-col justify-between overflow-hidden border-b border-solid border-base-content p-7 sm:p-10 lg:min-h-[650px] lg:border-b-0 lg:border-r">
          <div
            aria-hidden="true"
            class="bg-sphere shadow-sphere absolute right-[8%] top-[17%] size-52 rounded-full"
          ></div>
          <div class="flex items-center justify-between text-label case-upper tracking-label">
            <span>System // Account</span>
            <span>90 / 106</span>
          </div>
          <div class="relative z-10">
            <h1 class="text-display tracking-display font-medium">
              Welcome
              <br />
              back
            </h1>
            <p class="mt-8 max-w-sm text-sm text-base-content/50">
              Sign in to your account
            </p>
          </div>
          <div class="grid grid-cols-[auto_1fr_auto] items-center gap-4 text-label case-upper tracking-rule">
            <span>Slop Free</span>
            <span class="h-px bg-base-content/25"></span>
            <span>Network</span>
          </div>
        </header>

        <form
          data-signals:fetching="false"
          data-on:submit="@post('/login', {contentType: 'form'})"
          data-indicator:fetching
          class="grid content-center gap-10 p-7 sm:p-10 lg:p-12"
        >
          <div id="message"></div>
          <div class="grid grid-cols-2 border border-solid border-base-content text-center text-label case-upper tracking-tab">
            <span class="border-r border-solid border-base-content px-3 py-3">
              Account
            </span>
            <span class="px-3 py-3">Secure</span>
          </div>
          <div class="grid gap-4">
            <label
              class="text-label case-upper tracking-label text-base-content/60"
              for="email"
            >
              Email
            </label>
            <input
              class="h-14 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>
          <div class="grid gap-4">
            <label
              class="text-label case-upper tracking-label text-base-content/60"
              for="pass"
            >
              Password
            </label>
            <input
              class="h-14 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
              id="pass"
              name="pass"
              type="password"
              placeholder="••••••••••••"
              autocomplete="current-password"
              required
            />
          </div>
          <button
            class="h-14 w-full cursor-pointer border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85"
            type="submit"
            data-attr:disabled="$fetching"
          >
            <span data-text="$fetching ? 'Processing...' : 'Continue'">
              Continue
            </span>
          </button>
          <p class="text-note case-upper tracking-note text-base-content/35">
            Applicant / Recruiter
          </p>
        </form>
      </section>
    </main>,
  );
});

login.post("/", async (c) => {
  const body = await c.req.parseBody();
  const email = body.email as string;
  const pass = body.pass as string;

  const user = await c.env.slopfreeworkdb
    .prepare(
      "SELECT id, password_hash, email_verified FROM users WHERE email = ?1",
    )
    .bind(email)
    .first();

  const err = (msg: string) =>
    ServerSentEventGenerator.stream((stream) => {
      stream.patchElements(
        String(
          html`<div
            class="p-4 border border-solid border-error bg-error/10 text-error text-sm"
          >
            ${msg}
          </div>`,
        ),
        { selector: "#message", mode: "inner" },
      );
    });

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
    return ServerSentEventGenerator.stream((stream) => {
      stream.patchElements(
        String(
          html`<div
            class="p-4 border border-solid border-warning bg-warning/10 text-warning text-sm"
          >
            Please verify your email first.
          </div>`,
        ),
        { selector: "#message", mode: "inner" },
      );
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

  const sseResponse = ServerSentEventGenerator.stream((stream) => {
    stream.patchElements(
      String(
        html`<div
          class="p-4 border border-solid border-success bg-success/10 text-success text-sm"
        >
          Login successful. Redirecting...
        </div>`,
      ),
      { selector: "#message", mode: "inner" },
    );
    stream.executeScript('window.location.href = "/"');
  });

  const cookieHeader = c.res.headers.get("set-cookie");
  if (cookieHeader) {
    sseResponse.headers.append("set-cookie", cookieHeader);
  }

  return sseResponse;
});

export default login;
