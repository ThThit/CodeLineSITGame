import { useState } from "react";
import type { Screen } from "@/types/navigation";
import { AuthLayout } from "@/features/auth/AuthLayout";
import { Home } from "@/features/instructor/Home";
import { QuestionBank } from "@/features/instructor/QuestionBank";
import { CreateQuestion } from "@/features/instructor/CreateQuestion";
import { SessionSetup } from "@/features/instructor/SessionSetup";
import { Lobby } from "@/features/instructor/Lobby";
import { LiveGame } from "@/features/instructor/LiveGame";
import { Results } from "@/features/instructor/Results";
import { Dashboard } from "@/features/instructor/Dashboard";
import { Join } from "@/features/student/Join";
import { Waiting } from "@/features/student/Waiting";
import { StudentGame } from "@/features/student/StudentGame";
import { StudentLeaderboard } from "@/features/student/StudentLeaderboard";
import { StudentProgress } from "@/features/student/StudentProgress";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login-instructor");
  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  switch (screen) {
    case "login-instructor":
      return (
        <AuthLayout
          role="instructor"
          onSwitch={() => go("login-student")}
          onContinue={() => go("home")}
        />
      );
    case "home":
      return <Home go={go} />;
    case "questions":
      return <QuestionBank go={go} />;
    case "create-question":
      return <CreateQuestion go={go} />;
    case "setup":
      return <SessionSetup go={go} />;
    case "lobby":
      return <Lobby go={go} />;
    case "live":
      return <LiveGame go={go} />;
    case "results":
      return <Results go={go} />;
    case "dashboard":
      return <Dashboard go={go} />;
    case "login-student":
      return (
        <AuthLayout
          role="student"
          onSwitch={() => go("login-instructor")}
          onContinue={() => go("join")}
        />
      );
    case "join":
      return <Join go={go} />;
    case "waiting":
      return <Waiting go={go} />;
    case "game":
      return <StudentGame go={go} />;
    case "leaderboard":
      return <StudentLeaderboard go={go} />;
    case "progress":
      return <StudentProgress go={go} />;
  }
}
