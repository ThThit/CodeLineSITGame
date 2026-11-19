import { useState, type FormEvent } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { SIT_DOMAIN, checkSignIn, demoAccounts } from "@/data/accounts";

/**
 * Screens 1 and 10 (mock): one sign-in for everyone. The SIT email decides
 * where you land: student IDs go to Join, staff addresses go to instructor Home.
 */
export function Login({ go }: ScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ field: "email" | "password"; text: string } | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = checkSignIn(email, password);
    if (!result.ok) {
      setError({ field: result.field, text: result.error });
      document.getElementById(result.field === "email" ? "login-email" : "login-password")?.focus();
      return;
    }
    go(result.role === "student" ? "join" : "home");
  }

  function fillAccount(address: string) {
    setEmail(address);
    setPassword("demo1234");
    setError(null);
  }

  const emailError = error?.field === "email" ? error.text : "";
  const passwordError = error?.field === "password" ? error.text : "";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-cream font-sans text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-[-6rem] size-72 rounded-full bg-sun opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-24 size-52 rotate-12 rounded-[48px] bg-sky opacity-70"
      />

      <header className="relative mx-auto flex w-full max-w-[1080px] items-center justify-between px-4 pt-6 sm:px-6">
        <Logo />
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-extrabold uppercase tracking-[0.06em]">
          Mock sign-in
        </span>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          <form
            onSubmit={submit}
            noValidate
            className="flex flex-col gap-4 rounded-[26px] border-[3px] border-ink bg-white p-6 shadow-pop-lg sm:p-8"
          >
            <div>
              <h1 className="font-display text-[32px] font-bold leading-tight">Sign in</h1>
              <p className="mt-1 text-[15px] font-semibold text-soft">
                Use your SIT account. We’ll take you to the student or instructor side.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-sm font-extrabold">
                SIT email
              </label>
              <input
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error?.field === "email") setError(null);
                }}
                placeholder={`name@${SIT_DOMAIN}`}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "login-email-error" : undefined}
                className={`min-h-12 rounded-xl border-[2.5px] bg-white px-3.5 text-base font-semibold outline-none placeholder:text-soft/70 focus:shadow-[0_0_0_4px_var(--sun)] ${
                  emailError ? "border-[#b42318]" : "border-ink"
                }`}
              />
              {emailError && (
                <p id="login-email-error" role="alert" className="text-sm font-bold text-[#b42318]">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-extrabold">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error?.field === "password") setError(null);
                  }}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "login-password-error" : undefined}
                  className={`min-h-12 w-full rounded-xl border-[2.5px] bg-white pl-3.5 pr-20 text-base font-semibold outline-none focus:shadow-[0_0_0_4px_var(--sun)] ${
                    passwordError ? "border-[#b42318]" : "border-ink"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 min-h-9 -translate-y-1/2 rounded-lg px-2.5 text-sm font-extrabold hover:bg-paper"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <p
                  id="login-password-error"
                  role="alert"
                  className="text-sm font-bold text-[#b42318]"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-1 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-primary font-display text-xl font-bold shadow-pop transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              Sign in <Icon name="arrow" size={20} />
            </button>
          </form>

          <section
            aria-labelledby="demo-accounts"
            className="mt-5 rounded-2xl border border-line bg-white/80 p-4"
          >
            <h2 id="demo-accounts" className="text-sm font-extrabold">
              Demo accounts
            </h2>
            <p className="mt-0.5 text-[13px] font-semibold text-soft">
              Student IDs sign in as students; other SIT addresses sign in as instructors. Any
              password works.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {demoAccounts.map((a) => (
                <li key={a.email}>
                  <button
                    type="button"
                    onClick={() => fillAccount(a.email)}
                    className="flex min-h-11 w-full flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-xl border-[1.5px] border-line bg-white px-3 py-2 text-left hover:border-ink"
                  >
                    <span className="text-sm font-extrabold">{a.label}</span>
                    <span className="break-all font-mono text-xs font-semibold text-soft">
                      {a.email}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
