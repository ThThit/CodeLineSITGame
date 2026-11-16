import { useSyncExternalStore } from "react";
import { codeLines } from "@/data/mock";

/**
 * In-memory question bank for the demo. Lives for the browser tab only
 * (a refresh resets it). Shared by Question Bank, the editor and Session setup.
 */
export type Question = {
  id: string;
  title: string;
  topics: string[];
  pseudocode: string;
  code: string;
  /** ms timestamp */
  updatedAt: number;
};

const DAY = 86_400_000;
const now = Date.now();

let questions: Question[] = [
  {
    id: "q1",
    title: "Sum an array",
    topics: ["Arrays", "Loops"],
    pseudocode:
      "Create a variable to hold the total\nLoop through each number\nAdd it to the total\nReturn the total",
    code: codeLines.join("\n"),
    updatedAt: now - 2 * DAY,
  },
  {
    id: "q2",
    title: "Find the largest value",
    topics: ["Arrays", "Conditionals"],
    pseudocode:
      "Assume the first number is the largest\nLook at every other number\nIf it is bigger, remember it\nReturn the largest",
    code: [
      "public static int max(int[] nums) {",
      "    int best = nums[0];",
      "    for (int i = 1; i < nums.length; i++) {",
      "        if (nums[i] > best) {",
      "            best = nums[i];",
      "        }",
      "    }",
      "    return best;",
      "}",
    ].join("\n"),
    updatedAt: now - 4 * DAY,
  },
  {
    id: "q3",
    title: "FizzBuzz",
    topics: ["Loops", "Conditionals"],
    pseudocode:
      "Count from 1 to n\nMultiples of 15 print FizzBuzz\nMultiples of 3 print Fizz\nMultiples of 5 print Buzz\nOtherwise print the number",
    code: [
      "for (int i = 1; i <= n; i++) {",
      "    if (i % 15 == 0) {",
      '        System.out.println("FizzBuzz");',
      "    } else if (i % 3 == 0) {",
      '        System.out.println("Fizz");',
      "    } else if (i % 5 == 0) {",
      '        System.out.println("Buzz");',
      "    } else {",
      "        System.out.println(i);",
      "    }",
      "}",
    ].join("\n"),
    updatedAt: now - 7 * DAY,
  },
  {
    id: "q4",
    title: "Reverse a string",
    topics: ["Strings", "Loops"],
    pseudocode:
      "Start with an empty result\nWalk the string from the end\nAppend each character\nReturn the result",
    code: [
      "public static String reverse(String s) {",
      '    String out = "";',
      "    for (int i = s.length() - 1; i >= 0; i--) {",
      "        out += s.charAt(i);",
      "    }",
      "    return out;",
      "}",
    ].join("\n"),
    updatedAt: now - 8 * DAY,
  },
  {
    id: "q5",
    title: "Count vowels",
    topics: ["Strings", "Conditionals"],
    pseudocode:
      "Start a counter at zero\nLook at each character\nIf it is a vowel, add one\nReturn the counter",
    code: [
      "public static int vowels(String s) {",
      "    int count = 0;",
      "    for (char c : s.toLowerCase().toCharArray()) {",
      '        if ("aeiou".indexOf(c) >= 0) {',
      "            count++;",
      "        }",
      "    }",
      "    return count;",
      "}",
    ].join("\n"),
    updatedAt: now - 14 * DAY,
  },
];

/** Question the editor should open (null = new question). */
let editingId: string | null = null;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useQuestions() {
  return useSyncExternalStore(subscribe, () => questions);
}

export const questionStore = {
  get: (id: string) => questions.find((q) => q.id === id),
  save(input: Omit<Question, "id" | "updatedAt">, id?: string) {
    if (id && questions.some((q) => q.id === id)) {
      questions = questions.map((q) =>
        q.id === id ? { ...q, ...input, updatedAt: Date.now() } : q,
      );
    } else {
      questions = [{ ...input, id: crypto.randomUUID(), updatedAt: Date.now() }, ...questions];
    }
    emit();
  },
  duplicate(id: string) {
    const q = questions.find((x) => x.id === id);
    if (!q) return;
    const copy = {
      ...q,
      id: crypto.randomUUID(),
      title: `${q.title} (copy)`,
      updatedAt: Date.now(),
    };
    const at = questions.indexOf(q);
    questions = [...questions.slice(0, at + 1), copy, ...questions.slice(at + 1)];
    emit();
  },
  /** Removes and returns a function that puts it back (for Undo). */
  remove(id: string) {
    const at = questions.findIndex((q) => q.id === id);
    if (at < 0) return () => {};
    const removed = questions[at];
    questions = questions.filter((q) => q.id !== id);
    emit();
    return () => {
      questions = [...questions.slice(0, at), removed, ...questions.slice(at)];
      emit();
    };
  },
  startEdit(id: string | null) {
    editingId = id;
  },
  editing: () => (editingId ? (questions.find((q) => q.id === editingId) ?? null) : null),
};

export function lineCount(code: string) {
  return code.split(/\r?\n/).filter((l) => l.trim() !== "").length;
}

export function relativeDate(ms: number) {
  const days = Math.floor((Date.now() - ms) / DAY);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}
