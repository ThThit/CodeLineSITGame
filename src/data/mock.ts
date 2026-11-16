export const codeLines = [
  "public static int sum(int[] nums) {",
  "    int total = 0;",
  "    for (int num : nums) {",
  "        total += num;",
  "    }",
  "    return total;",
  "}",
];

export const students = [
  ["Maya Chen", 1240],
  ["Theo Martin", 1180],
  ["Amara Okafor", 1120],
  ["Lucas Silva", 1060],
  ["Sofia Patel", 980],
  ["Noah Williams", 920],
  ["Leila Hassan", 860],
  ["Ethan Kim", 810],
  ["Zoe Brown", 760],
  ["Sam Rivera", 720],
] as const;

export const questions = [
  ["Sum an array", "Arrays · Loops", "7 lines", "2 days ago"],
  ["Find the largest value", "Arrays · Conditionals", "9 lines", "4 days ago"],
  ["FizzBuzz", "Loops · Conditionals", "12 lines", "1 week ago"],
  ["Reverse a string", "Strings · Loops", "8 lines", "1 week ago"],
  ["Count vowels", "Strings · Conditionals", "11 lines", "2 weeks ago"],
] as const;
