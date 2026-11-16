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

export const session = {
  name: "Java Arrays Review",
  purpose: "Activity",
  rounds: 2,
  gameCode: "847291",
  classSize: 42,
  instructor: "Alex",
};

/** The signed-in student for the student screens. */
export const me = { name: "Maya Chen", firstName: "Maya" };

export const extraJoined = ["Priya Nair", "Kai Tanaka", "Ava Rossi", "Omar Aziz"];

export const roundResults = [
  ["Theo Martin", 1240],
  ["Maya Chen", 1180],
  ["Amara Okafor", 1120],
  ["Lucas Silva", 1060],
  ["Sofia Patel", 980],
  ["Noah Williams", 920],
  ["Leila Hassan", 860],
] as const;

export const allRoundsResults = [
  ["Maya Chen", 2360],
  ["Theo Martin", 2310],
  ["Amara Okafor", 2180],
  ["Sofia Patel", 2040],
  ["Lucas Silva", 1990],
  ["Leila Hassan", 1820],
  ["Noah Williams", 1790],
] as const;

/** Everyone who joins in the lobby simulation, in join order. */
export const joinOrder = [
  ...students.map(([name]) => name),
  ...extraJoined,
  "Lina Park",
  "Mateo Garcia",
  "Hana Sato",
  "Jonas Weber",
  "Ines Costa",
  "Yusuf Demir",
  "Chloe Martin",
  "Ravi Shah",
  "Elena Petrova",
  "Ben Carter",
  "Aisha Bello",
  "Tom Nguyen",
  "Mia Novak",
  "Diego Ramos",
  "Sara Lind",
  "Felix Braun",
];
