import { css, cx } from "hono/css";
import type { FC } from "hono/jsx";

const registerSectionClass = css`
    background-color: var(--color-base-200);
    display: grid;
    place-items: center;
    padding: var(--space-10) var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
`;

const registerContainerClass = css`
    background-color: var(--color-base-100);
    display: grid;
    width: 100%;
    max-width: var(--size-5xl);
    border: var(--line-width-default) solid var(--color-base-content);
    @media (min-width: 1024px) {
        grid-template-columns: 1.25fr 0.75fr;
    }
`;

const registerHeaderClass = css`
    position: relative;
    display: flex;
    min-height: 24rem;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    border-bottom: var(--line-width-default) solid var(--color-base-content);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
    @media (min-width: 1024px) {
        border-bottom: 0;
        border-right: var(--line-width-default) solid var(--color-base-content);
    }
`;

const registerSphereClass = css`
    position: absolute;
    right: 14%;
    top: 24%;
    width: 8rem;
    height: 8rem;
    border-radius: var(--radius-full);
`;

const registerHeaderTopClass = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
`;

const registerHeadingWrapClass = css`
    position: relative;
    z-index: 10;
`;

const registerHeadingClass = css`
    font-size: clamp(var(--text-5xl), 6vw, var(--space-20));
    font-weight: var(--weight-medium);
    line-height: 0.9;
    letter-spacing: var(--tracking-tighter);
`;

const registerSubTextClass = css`
    margin-top: var(--space-8);
    font-size: var(--text-sm);
    color: var(--color-content-faint);
`;

const registerFooterClass = css`
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-rule);
`;

const registerDividerClass = css`
    height: var(--line-width-default);
    background-color: color-mix(in oklab, var(--color-base-content) 25%, transparent);
`;

const registerFormClass = css`
    display: grid;
    align-content: center;
    gap: var(--space-8);
    padding: var(--space-6);
    @media (min-width: 768px) {
        padding: var(--space-12);
    }
`;

const registerTabsClass = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: var(--line-width-default) solid var(--color-base-content);
    text-align: center;
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tab);
`;

const registerTabActiveClass = css`
    border-right: var(--line-width-default) solid var(--color-base-content);
    padding: var(--space-3);
`;

const registerTabClass = css`
    padding: var(--space-3);
`;

const registerFieldClass = css`
    display: grid;
    gap: var(--space-4);
`;

const registerLabelClass = css`
    font-size: var(--text-label);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    color: var(--color-content-muted);
`;

const registerInputClass = css`
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

const registerButtonClass = css`
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

const registerNoteClass = css`
    font-size: var(--text-note);
    text-transform: uppercase;
    letter-spacing: var(--tracking-note);
    color: color-mix(in oklab, var(--color-base-content) 35%, transparent);
`;

export const Register: FC = () => (
	<section class={registerSectionClass}>
		<div class={registerContainerClass}>
			<header class={registerHeaderClass}>
				<div
					aria-hidden="true"
					class={cx("bg-sphere shadow-sphere", registerSphereClass)}
				></div>
				<div class={registerHeaderTopClass}>
					<span>System // Account</span>
					<span>90 / 106</span>
				</div>
				<div class={registerHeadingWrapClass}>
					<h2 class={registerHeadingClass}>
						Ready to
						<br />
						work?
					</h2>
					<p class={registerSubTextClass}>Join the talent network</p>
				</div>
				<div class={registerFooterClass}>
					<span>Slop Free</span>
					<span class={registerDividerClass}></span>
					<span>Talent Network</span>
				</div>
			</header>
			<form class={registerFormClass}>
				<div class={registerTabsClass}>
					<span class={registerTabActiveClass}>Account</span>
					<span class={registerTabClass}>Secure</span>
				</div>
				<div class={registerFieldClass}>
					<label class={registerLabelClass} for="cta-email">
						Email
					</label>
					<input
						class={registerInputClass}
						id="cta-email"
						name="email"
						type="email"
						placeholder="you@example.com"
						autocomplete="email"
						required
					/>
				</div>
				<button class={registerButtonClass} type="submit">
					Continue
				</button>
				<p class={registerNoteClass}>Applicant / Recruiter</p>
			</form>
		</div>
	</section>
);
