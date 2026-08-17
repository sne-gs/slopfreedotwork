import { Hono } from 'hono'

const login = new Hono()

login.get('/', (c) => {
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
              Welcome<br />back
            </h1>
            <p class="mt-8 max-w-sm text-sm text-base-content/50">Sign in to your account</p>
          </div>

          <div class="grid grid-cols-[auto_1fr_auto] items-center gap-4 text-label case-upper tracking-rule">
            <span>Slop Free</span>
            <span class="h-px bg-base-content/25"></span>
            <span>Network</span>
          </div>
        </header>

        <form class="grid content-center gap-10 p-7 sm:p-10 lg:p-12">
          <div class="grid grid-cols-2 border border-solid border-base-content text-center text-label case-upper tracking-tab">
            <span class="border-r border-solid border-base-content px-3 py-3">Account</span>
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

          <button
            class="h-14 w-full cursor-pointer border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85"
            type="submit"
          >
            Continue
          </button>

          <p class="text-note case-upper tracking-note text-base-content/35">
            Applicant / Recruiter
          </p>
        </form>
      </section>
    </main>
  )
})

export default login
