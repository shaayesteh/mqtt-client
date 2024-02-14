import { expect, test } from "vitest";
import { filterTopic } from "./mqtt-topic-filter.ts";

test("filter works correctly", () => {
  expect(filterTopic("a/b/c", "a/#")).toBe(true);
  expect(filterTopic("a/b/c", "a/+/c")).toBe(true);
  expect(filterTopic("a/b/c", "a/+/+")).toBe(true);
  expect(filterTopic("a/b/c", "a/b/c")).toBe(true);
  expect(filterTopic("a/b/c", "a/b/c/d")).toBe(false);
  expect(filterTopic("a/b/c", "a/b")).toBe(false);
  expect(filterTopic("a/b/c", "a/b/c/")).toBe(false);
  expect(filterTopic("a/b/c", "a/b/c/d/")).toBe(false);
  expect(filterTopic("a/b/c", "a/b/c/#")).toBe(false);
  try {
    filterTopic("a/b/c", "a/b/c/#/");
  } catch (e) {
    e instanceof Error &&
      expect(e.message).toBe(
        "wrong usage of # in topic filter, only use # at the end once",
      );
  }
});
