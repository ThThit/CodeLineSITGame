import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";

export function AuthLayout({
  role,
  onSwitch,
  onContinue,
}: {
  role: "instructor" | "student";
  onSwitch: () => void;
  onContinue: () => void;
}) {
  const instructor = role === "instructor";
  return (
    <div className="auth-page">
      <header className="auth-header">
        <Logo />
        <button
          onClick={onSwitch}
          className="text-sm font-bold text-slate-600 hover:text-violet-700"
        >
          {instructor ? "Student login" : "Instructor login"} <span className="ml-1">→</span>
        </button>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <div className="eyebrow">{instructor ? "Instructor portal" : "Student portal"}</div>
          <h1>{instructor ? "Make code click." : "Ready to play?"}</h1>
          <p className="mt-3 text-[16px] leading-7 text-slate-500">
            {instructor
              ? "Turn Java practice into a fast, collaborative classroom game."
              : "Sign in with your university account to join your class."}
          </p>
          <button onClick={onContinue} className="university-button">
            <span className="university-icon">
              <Icon name="bank" size={19} />
            </span>
            Continue with University Account
            <Icon name="arrow" size={19} />
          </button>
          <div className="divider">
            <span>or use email</span>
          </div>
          <label className="field-label" htmlFor={`${role}-email`}>
            University email
          </label>
          <input
            id={`${role}-email`}
            className="input"
            defaultValue={instructor ? "alex.morgan@northbridge.edu" : "maya.chen@northbridge.edu"}
          />
          <label className="field-label mt-4" htmlFor={`${role}-password`}>
            Password
          </label>
          <input
            id={`${role}-password`}
            type="password"
            className="input"
            defaultValue="password123"
          />
          <Button onClick={onContinue} className="mt-6 w-full justify-center">
            Sign in <Icon name="arrow" size={18} />
          </Button>
          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to CodeLine’s Terms and Privacy Policy.
          </p>
        </section>
      </main>
      <div className="auth-art" aria-hidden="true">
        <span className="code-chip chip-a">int score = 100;</span>
        <span className="code-chip chip-b">if (correct) &#123;</span>
        <span className="code-chip chip-c">return total;</span>
      </div>
    </div>
  );
}
