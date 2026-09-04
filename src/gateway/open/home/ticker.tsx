import { css, cx } from "hono/css";
import type { FC } from "hono/jsx";

const tickerItems = [
	"No slop",
	"Human-based",
	"Handcrafted",
	"Artisanal",
	"Organic",
	"Cage-Free",
];

const itemsToRender = [
	...tickerItems,
	...tickerItems,
	...tickerItems,
	...tickerItems,
];

const tickerWrapperClass = css`
    overflow: hidden;
    background-color: var(--color-base-100);
    padding-block: var(--space-2);
`;

const tickerTrackClass = css`
    display: flex;
    white-space: nowrap;
    width: max-content;
`;

const tickerHalfClass = css`
    display: flex;
    flex-shrink: 0;
`;

const tickerItemClass = css`
    display: inline-flex;
    align-items: center;
    gap: var(--space-8);
    margin-inline: var(--space-4);
    font-size: var(--text-xs);
    font-weight: var(--weight-bold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-button);
`;

const tickerDividerClass = css`
    color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
`;

export const Ticker: FC = () => (
	<div class={tickerWrapperClass}>
		<div class={cx("animate-marquee", tickerTrackClass)}>
			{[0, 1].map((half) => (
				<div
					key={half}
					class={tickerHalfClass}
					aria-hidden={half === 1 ? "true" : undefined}
				>
					{itemsToRender.map((item, index) => (
						<span key={`${half}-${index}`} class={tickerItemClass}>
							{item}
							<span class={tickerDividerClass}>//</span>
						</span>
					))}
				</div>
			))}
		</div>
	</div>
);
