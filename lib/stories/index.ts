import type { Story } from "@/lib/types";
import { romeoAndJuliet } from "./romeo-and-juliet";
import { macbeth } from "./macbeth";
import { titanic } from "./titanic";

/**
 * Story registry. To add a story, author a self-contained `lib/stories/<id>.ts`
 * exporting a `Story`, import it here, and add it to `ALL_STORIES` — the picker,
 * store and everything downstream update automatically.
 */
const ALL_STORIES: Story[] = [romeoAndJuliet, macbeth, titanic];

export const stories: Record<string, Story> = Object.fromEntries(
  ALL_STORIES.map((story) => [story.id, story]),
);

export const storyList: { id: string; title: string; author: string }[] =
  ALL_STORIES.map(({ id, title, author }) => ({ id, title, author }));

export { romeoAndJuliet, macbeth, titanic };
