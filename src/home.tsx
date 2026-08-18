import { Hono } from 'hono'

const home = new Hono()

const stats = [
  { label: 'Open Roles', value: '1,204', frame: '' },
  { label: 'Companies', value: '318', frame: 'border-l' },
  { label: 'Talent Pool', value: '12,408', frame: 'border-t lg:border-t-0 lg:border-l' },
  { label: 'Match Rate', value: '97.4%', frame: 'border-l border-t lg:border-t-0' },
]

const steps = [
  { index: '01', title: 'Initialize', body: 'Create a profile, upload your resume.' },
  { index: '02', title: 'Match', body: 'Search for jobs, subscribe to companies.' },
  { index: '03', title: 'Execute', body: 'Get an offer, don\'t starve to death!' },
]

const roles = [
  { title: 'Senior Frontend Engineer', company: 'Datastar Systems', location: 'Remote // UTC+8', salary: '$140K–$180K', type: 'Full-time', href: '/jobs/senior-frontend-engineer' },
  { title: 'Product Designer', company: 'Nullpoint Labs', location: 'Berlin', salary: '€70K–$90K', type: 'Contract', href: '/jobs/product-designer' },
  { title: 'ML Infrastructure Engineer', company: 'Hexcore', location: 'Remote // UTC-5', salary: '$160K–$210K', type: 'Full-time', href: '/jobs/ml-infrastructure-engineer' },
  { title: 'Technical Writer', company: 'Gridware', location: 'Lisbon', salary: '€45K–$60K', type: 'Part-time', href: '/jobs/technical-writer' },
]

const companies = [
  { name: 'Datastar', open: 12, href: '/companies/datastar' },
  { name: 'Nullpoint', open: 8, href: '/companies/nullpoint' },
  { name: 'Hexcore', open: 21, href: '/companies/hexcore' },
  { name: 'Gridware', open: 5, href: '/companies/gridware' },
  { name: 'Oktal', open: 9, href: '/companies/oktal' },
  { name: 'V∆NTA-9', open: 3, href: '/companies/vonta-9' },
]

const ticker = ['No slop', 'Human-based', 'Handcrafted', 'Artisanal', 'Organic', 'Cage-Free']

home.get('/', (c) => {
  return c.render(
    <div class="flex min-h-screen flex-col bg-base-100 font-sans text-base-content">

      <nav class="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-base-300 bg-base-100 px-6 py-4">
        <a href="/" class="flex items-center gap-2 text-xs font-semibold text-base-content/50">
          <span class="relative inline-grid place-items-center">
            <span class="case-upper text-lg font-extrabold tracking-[-0.02em] text-base-content">Slop</span>
            <span aria-hidden="true" class="absolute -inset-x-2 top-1/2 h-[3px] -translate-y-1/2 -rotate-6 bg-error"></span>
          </span>
          .work
        </a>
        <div class="flex items-center gap-8 text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">
          <a href="/jobs" class="hidden transition-colors hover:text-base-content md:inline">Jobs</a>
          <a href="/companies" class="hidden transition-colors hover:text-base-content md:inline">Companies</a>
          <a href="/login" class="hidden transition-colors hover:text-base-content md:inline">Sign In</a>
          <a href="/register" class="inline-flex h-10 items-center border-0 bg-neutral px-6 text-neutral-content transition-colors hover:bg-neutral/85">Get Access</a>
        </div>
      </nav>

      <header class="relative overflow-hidden border-b border-solid border-base-300 px-6 pb-16 pt-10 md:px-12 md:pb-20 md:pt-14 bg-dot-fade">
        <div class="mb-10 flex items-center justify-between text-label case-upper tracking-label text-base-content/50">
          <span>System // Slop Free Talent Network</span>
          <span class="bg-base-200 py-1 px-2">90 / 106</span>
        </div>

        <div class="relative">
          <img class="ml-[-3vw] w-[58%]" src="/static/prompts.svg" alt="Make no mistakes." />
          <div
            aria-hidden="true"
            class="bg-sphere shadow-sphere pointer-events-none absolute right-[0%] top-[0%] z-10 size-40 rounded-full sm:size-60  md:size-80 lg:size-120 xl:size-180"
          ></div>
        </div>

        <p class="mt-8 max-w-md text-sm leading-relaxed text-base-content/50">
          A place for serious businesses<br class="hidden md:block" />
          that don't tolerate AI slop.
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a href="/register" class="inline-flex h-12 items-center border-0 bg-neutral px-10 text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85">
            Add your company
          </a>
          <a href="/jobs" class="inline-flex h-12 items-center border border-solid border-base-content bg-base-100 px-10 text-xs case-upper tracking-button transition-colors hover:bg-base-200">
            Find a job
          </a>
        </div>
      </header>

      <div class="overflow-hidden border-b border-solid border-base-300 py-4">
        <div class="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((half) => (
            <div class="flex shrink-0" aria-hidden={half === 1 ? 'true' : undefined}>
              {ticker.map((item) => (
                <span class="mx-8 flex items-center gap-8 text-xs font-bold case-upper tracking-[0.25em]">
                  {item}
                  <span class="text-base-content/40">//</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section class="grid grid-cols-2 lg:grid-cols-4 border-b border-solid border-base-300">
        {stats.map((stat) => (
          <div class={`border-solid border-base-300 p-6 md:p-10 ${stat.frame}`}>
            <span class="text-label case-upper tracking-label text-base-content/50">{stat.label}</span>
            <p class="mt-4 text-4xl font-medium tracking-[-0.02em] md:text-5xl">{stat.value}</p>
          </div>
        ))}
      </section>

      <section class="grid gap-12 md:px-12 lg:grid-cols-[1fr_2fr] lg:gap-0 border-b border-solid border-base-300">
        <div class="lg:pr-10 lg:pt-10">
          <span class="block text-label case-upper tracking-label text-base-content/50">System // Protocol</span>
          <h2 class="mt-6 text-5xl font-medium tracking-[-0.04em] md:text-6xl">Three steps.</h2>
        </div>
        <div class="grid md:grid-cols-3">
          {steps.map((step) => (
            <div class="border-l border-solid border-base-300 py-1 pl-6 pr-6 md:pl-8">
              <span class="text-label case-upper tracking-label text-base-content/40">{step.index}</span>
              <h3 class="mt-6 text-sm font-semibold case-upper tracking-[0.2em]">{step.title}</h3>
              <p class="mt-4 max-w-55 text-xs leading-relaxed text-base-content/50">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section class="px-6 pb-16 md:px-12 md:py-12">
        <div class="mb-8 flex items-center justify-between">
          <span class="text-label case-upper tracking-label text-base-content/50">Network // Open Roles</span>
          <a href="/jobs" class="flex items-center gap-2 text-label font-semibold case-upper tracking-label underline underline-offset-4 transition-colors hover:text-base-content/60">
            View all roles <span aria-hidden="true">→</span>
          </a>
        </div>

        <ul class="border-t border-solid border-base-300">
          {roles.map((role) => (
            <li>
              <a
                href={role.href}
                class="grid items-center gap-3 border-b border-solid border-base-300 py-5 transition-colors hover:bg-base-200 md:grid-cols-[2.2fr_1.4fr_1.4fr_1.1fr_auto_2rem] md:gap-6 md:px-2"
              >
                <span class="text-sm font-semibold md:text-base">{role.title}</span>
                <span class="text-label case-upper tracking-label text-base-content/50">{role.company}</span>
                <span class="text-label case-upper tracking-label text-base-content/50">{role.location}</span>
                <span class="text-sm font-semibold">{role.salary}</span>
                <span class="inline-flex h-8 w-max items-center border border-solid border-base-content px-4 text-label case-upper tracking-tab">
                  {role.type}
                </span>
                <span class="hidden text-right md:block" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
       </ul>
      </section>

      <section class="px-6 pb-20 md:px-12">
        <span class="text-label case-upper tracking-label text-base-content/50">Network // Companies</span>
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <a
              href={company.href}
              class="flex min-h-28 flex-col justify-between border border-solid border-base-content p-5 transition-colors hover:bg-base-200"
            >
              <span class="text-sm font-semibold case-upper tracking-[0.2em]">{company.name}</span>
              <span class="mt-8 text-label case-upper tracking-label text-base-content/50">{company.open} open roles</span>
            </a>
          ))}
        </div>
      </section>

      <section class="grid place-items-center px-6 pb-24 md:px-12">
        <div class="grid w-full max-w-5xl border border-solid border-base-content lg:grid-cols-[1.25fr_0.75fr]">
          <header class="relative flex min-h-96 flex-col justify-between overflow-hidden border-b border-solid border-base-content p-7 sm:p-10 lg:border-b-0 lg:border-r">
            <div aria-hidden="true" class="bg-sphere shadow-sphere absolute right-[14%] top-[24%] size-32 rounded-full"></div>

            <div class="flex items-center justify-between text-label case-upper tracking-label">
              <span>System // Account</span>
              <span>90 / 106</span>
            </div>

            <div class="relative z-10">
              <h2 class="text-[clamp(3rem,6vw,5rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                Ready to<br />work?
              </h2>
              <p class="mt-6 text-sm text-base-content/50">Join the talent network</p>
            </div>

            <div class="grid grid-cols-[auto_1fr_auto] items-center gap-4 text-label case-upper tracking-rule">
              <span>Slop Free</span>
              <span class="h-px bg-base-content/25"></span>
              <span>Talent Network</span>
            </div>
          </header>

          <form class="grid content-center gap-10 p-7 sm:p-10 lg:p-12">
            <div class="grid grid-cols-2 border border-solid border-base-content text-center text-label case-upper tracking-tab">
              <span class="border-r border-solid border-base-content px-3 py-3">Account</span>
              <span class="px-3 py-3">Secure</span>
            </div>

            <div class="grid gap-4">
              <label class="text-label case-upper tracking-label text-base-content/60" for="cta-email">Email</label>
              <input
                class="h-14 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none"
                id="cta-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
            </div>

            <button class="h-14 w-full cursor-pointer border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85" type="submit">
              Continue
            </button>

            <p class="text-note case-upper tracking-note text-base-content/35">Applicant / Recruiter</p>
          </form>
        </div>
      </section>

      <footer class="mt-auto border-t border-solid border-base-300 px-6 py-12">
        <div class="grid gap-12 text-xs md:grid-cols-4">
          <div>
            <h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">System</h4>
            <ul class="mt-6 grid gap-3 text-base-content/60">
              <li><a href="#" class="hover:text-base-content">Documentation</a></li>
              <li><a href="#" class="hover:text-base-content">API Status</a></li>
              <li><a href="#" class="hover:text-base-content">Release Notes</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">Network</h4>
            <ul class="mt-6 grid gap-3 text-base-content/60">
              <li><a href="/companies" class="hover:text-base-content">Companies</a></li>
              <li><a href="/jobs" class="hover:text-base-content">Open Roles</a></li>
              <li><a href="#" class="hover:text-base-content">Talent Pool</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">Protocols</h4>
            <ul class="mt-6 grid gap-3 text-base-content/60">
              <li><a href="#" class="hover:text-base-content">Terms of Service</a></li>
              <li><a href="#" class="hover:text-base-content">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="flex flex-col justify-between md:col-start-4 md:text-right">
            <span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/40">Node // 01</span>
            <span>
              <span class="font-brand text-xl bg-base-300 text-white px-2">snegs</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
})

export default home
