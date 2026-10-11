import type { Child } from "hono/jsx";
import { Caption } from "./Caption";

export const Header = ({
	heading,
	labels,
	action,
}: {
	readonly heading: string;
	readonly labels: readonly string[];
	readonly action: Child;
}) => {
	return (
		<header class="flex justify-between bg-base-100 p-12">
			<span>
				<Caption labels={labels} />
				<h1 class="font-medium text-5xl leading-[0.9] tracking-[-0.06em]">
					{heading}
				</h1>
			</span>
			<span>{action}</span>
		</header>
	);
};
