export const Footer = () => (
	<footer class="border-t border-solid border-base-300 px-6 py-12 mt-auto">
		<div class="grid md:grid-cols-4 gap-12 text-xs">
			<div>
				<h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60 mb-4">
					System
				</h4>
				<ul class="grid gap-3 mt-6 text-base-content/60">
					<li>
						<a href="/documentation" class="hover:text-base-content">
							Documentation
						</a>
					</li>
					<li>
						<a href="/api-status" class="hover:text-base-content">
							API Status
						</a>
					</li>
					<li>
						<a href="/release-notes" class="hover:text-base-content">
							Release Notes
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60 mb-4">
					Network
				</h4>
				<ul class="grid gap-3 mt-6 text-base-content/60">
					<li>
						<a href="/companies" class="hover:text-base-content">
							Companies
						</a>
					</li>
					<li>
						<a href="/jobs" class="hover:text-base-content">
							Open Roles
						</a>
					</li>
					<li>
						<a href="/talent-pool" class="hover:text-base-content">
							Talent Pool
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h4 class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/60 mb-4">
					Protocols
				</h4>
				<ul class="grid gap-3 mt-6 text-base-content/60">
					<li>
						<a href="/terms-of-service" class="hover:text-base-content">
							Terms of Service
						</a>
					</li>
					<li>
						<a href="/privacy-policy" class="hover:text-base-content">
							Privacy Policy
						</a>
					</li>
				</ul>
			</div>
			<div class="md:col-start-4 md:text-right flex flex-col justify-between">
				<span class="text-[0.65rem] case-upper tracking-[0.25em] text-base-content/40">
					Node // 02
				</span>
				<span>
					<span class="font-brand text-xl bg-base-300 text-white px-2">
						snegs
					</span>
				</span>
			</div>
		</div>
	</footer>
);
