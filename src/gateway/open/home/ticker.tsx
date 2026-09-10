import type { FC } from "hono/jsx";
import { cx } from "#gateway/shared";

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

const tickerWrapperClass = cx("bg-base-100", "overflow-hidden", "py-2");

const tickerTrackClass = cx("flex", "w-max", "whitespace-nowrap");

const tickerHalfClass = cx("flex", "shrink-0");

const tickerItemClass = cx(
	"font-bold",
	"gap-8",
	"inline-flex",
	"items-center",
	"mx-4",
	"text-xs",
	"tracking-button",
	"uppercase",
);

const tickerDividerClass = cx("text-base-content/40");

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
