import { css } from "hono/css";
import type { Child } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";

const mainClass = css`
	background-color: var(--color-base-300);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 1px;
`;

type MainType = (p: { children: Child }) => JSX.Element;

export const Main: MainType = ({ children }) => (
	<main class={mainClass}>{children}</main>
);
