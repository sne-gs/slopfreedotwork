const nav = () => (
  <nav class="border-b border-solid border-base-300 px-6 py-4 flex items-center justify-between sticky top-0 bg-base-100 z-50">
    <a
      href="/"
      class="flex items-center gap-2 text-xs font-semibold text-base-content/50"
    >
      <span class="relative inline-grid place-items-center">
        <span class="case-upper text-lg font-extrabold tracking-[-0.02em] text-base-content">
          Slop
        </span>
        <span
          aria-hidden="true"
          class="absolute -inset-x-2 top-1/2 h-[3px] -translate-y-1/2 -rotate-6 bg-error"
        ></span>
      </span>
      .work
    </a>
    <div class="hidden md:flex items-center gap-8 text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60">
      <a href="/jobs" class="hover:text-base-content transition-colors">
        Jobs
      </a>
      <a href="/companies" class="hover:text-base-content transition-colors">
        Companies
      </a>
      <a href="/login" class="hover:text-base-content transition-colors">
        Sign In
      </a>
    </div>
  </nav>
);

export default nav;
