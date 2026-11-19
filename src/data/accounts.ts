/**
 * Mock sign-in rules for the demo. Nothing is sent anywhere and no password is checked.
 *
 * Role comes from the email's local part:
 * - a student ID (digits only), e.g. 66130500001@sit.kmutt.ac.th → student
 * - anything else, e.g. alex.morgan@sit.kmutt.ac.th → instructor
 */

/** SIT email domain. Change here if the real domain differs. */
export const SIT_DOMAIN = "sit.kmutt.ac.th";

export type Role = "student" | "instructor";

/** Sample accounts shown on the sign-in screen so reviewers can try both roles. */
export const demoAccounts: { role: Role; email: string; label: string }[] = [
  { role: "student", email: `66130500001@${SIT_DOMAIN}`, label: "Student (Maya Chen)" },
  { role: "instructor", email: `alex.morgan@${SIT_DOMAIN}`, label: "Instructor (Alex Morgan)" },
];

export type SignInResult =
  | { ok: true; role: Role }
  | { ok: false; field: "email" | "password"; error: string };

export function checkSignIn(email: string, password: string): SignInResult {
  const value = email.trim().toLowerCase();
  if (!value) return { ok: false, field: "email", error: "Enter your SIT email." };
  const [local, domain, extra] = value.split("@");
  if (!local || !domain || extra !== undefined) {
    return { ok: false, field: "email", error: "That doesn’t look like an email address." };
  }
  if (domain !== SIT_DOMAIN) {
    return { ok: false, field: "email", error: `Use your SIT email, ending in @${SIT_DOMAIN}.` };
  }
  if (!password) return { ok: false, field: "password", error: "Enter your password." };
  return { ok: true, role: /^\d+$/.test(local) ? "student" : "instructor" };
}
