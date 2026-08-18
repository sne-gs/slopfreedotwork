import { Hono } from 'hono'

const register = new Hono()

register.get('/', (c) => {
  return c.render(
    <div class="min-h-screen flex flex-col bg-base-100 text-base-content font-sans">
      
      <nav class="border-b border-solid border-base-300 px-6 py-4 flex items-center justify-between sticky top-0 bg-base-100 z-50">
        <a href="/" class="flex items-center gap-2 text-xs font-semibold text-base-content/50">
          <span class="relative inline-grid place-items-center">
            <span class="case-upper text-lg font-extrabold tracking-[-0.02em] text-base-content">Slop</span>
            <span aria-hidden="true" class="absolute -inset-x-2 top-1/2 h-[3px] -translate-y-1/2 -rotate-6 bg-error"></span>
          </span>
          .work
        </a>

        <div class="hidden md:flex items-center gap-8 text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">
          <a href="/jobs" class="hover:text-base-content transition-colors">Jobs</a>
          <a href="/companies" class="hover:text-base-content transition-colors">Companies</a>
          <a href="/login" class="hover:text-base-content transition-colors">Sign In</a>
        </div>
      </nav>

      <header class="px-6 py-10 md:py-16 border-b border-solid border-base-300 bg-dot-fade">
        <span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/50 block mb-6">
          System // Registration Protocol
        </span>
        <h1 class="text-5xl md:text-8xl font-medium leading-[0.85] tracking-[-0.06em] max-w-3xl">
          Initialize<br/>your profile.
        </h1>
      </header>

      <main class="grid lg:grid-cols-[1fr_1.5fr] flex-grow">
        
        <aside class="border-b border-solid lg:border-b-0 lg:border-r border-solid border-base-300 p-6 md:p-12 flex flex-col justify-between">
          <div>
            <span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/50 block mb-6">Access Level</span>
            
            <div class="grid w-full border border-solid border-base-300">
              <button class="w-full text-left border-0 border-b border-solid border-base-300 bg-transparent hover:bg-base-200 p-4 text-sm case-upper tracking-[0.25em] transition-colors">
                Recruiter
              </button>
              <button class="w-full text-left border-0 bg-neutral text-neutral-content p-4 text-sm case-upper tracking-[0.25em] transition-colors hover:bg-neutral/85">
                Job Seeker
              </button>
            </div>
          </div>
          
          <p class="text-xs text-base-content/40 mt-12 max-w-xs leading-relaxed">
            By initializing a profile, you agree to the system terms and data processing protocols.
          </p>
        </aside>

        <section class="p-6 md:p-12 flex items-center">
          <form class="grid gap-10 w-full max-w-xl">
            
            <div class="grid md:grid-cols-2 gap-10">
              <div class="grid gap-2">
                <label class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60" for="fname">First Name</label>
                <input class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none" id="fname" type="text" placeholder="Jane" required />
              </div>
              <div class="grid gap-2">
                <label class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60" for="lname">Last Name</label>
                <input class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none" id="lname" type="text" placeholder="Doe" required />
              </div>
            </div>

            <div class="grid gap-2">
              <label class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60" for="email">Corporate Email</label>
              <input class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none" id="email" type="email" placeholder="jane@company.com" required />
            </div>

            <div class="grid gap-2">
              <label class="text-[0.65rem] case-upper tracking-[0.25em] tet-base-content/60" for="pass">Access Key</label>
              <input class="h-12 w-full border-0 border-b border-solid border-base-content bg-transparent px-0 text-sm placeholder:text-base-content/50 focus:outline-none" id="pass" type="password" placeholder="••••••••••••" required />
            </div>

            <div class="flex items-center gap-4 my-4">
              <input type="checkbox" class="size-4 border border-solid border-base-content accent-neutral cursor-pointer" id="terms" />
              <label for="terms" class="text-xs text-base-content/60 cursor-pointer">
                I accept the <a href="#" class="underline underline-offset-4 hover:text-base-content">data protocols</a>.
              </label>
            </div>

            <div class="pt-6 border-t border-solid border-base-300 flex items-center justify-between">
              <span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/40">Status: Ready</span>
              <button type="submit" class="h-12 px-10 cursor-pointer border-0 bg-neutral text-xs case-upper tracking-button text-neutral-content transition-colors hover:bg-neutral/85">
                Initialize
              </button>
            </div>

          </form>
        </section>
      </main>

      <footer class="border-t border-solid border-base-300 px-6 py-12 mt-auto">
        <div class="grid md:grid-cols-4 gap-12 text-xs">
          <div>
            <h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60 mb-4">System</h4>
            <ul class="grid gap-3 mt-6 text-base-content/60">
              <li><a href="#" class="hover:text-base-content">Documentation</a></li>
              <li><a href="#" class="hover:text-base-content">API Status</a></li>
              <li><a href="#" class="hover:text-base-content">Release Notes</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60 mb-4">Network</h4>
            <ul class="grid gap-3 mt-6 text-base-content/60">
              <li><a href="#" class="hover:text-base-content">Companies</a></li>
              <li><a href="#" class="hover:text-base-content">Open Roles</a></li>
              <li><a href="#" class="hover:text-base-content">Talent Pool</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60 mb-4">Protocols</h4>
            <ul class="grid gap-3 mt-6 text-base-content/60">
              <li><a href="#" class="hover:text-base-content">Terms of Service</a></li>
              <li><a href="#" class="hover:text-base-content">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="md:col-start-4 md:text-right flex flex-col justify-between">
            <span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/40">Node // 02</span>
            <span>
              <span class="font-brand text-xl bg-base-300 text-white px-2">snegs</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
})

export default register
