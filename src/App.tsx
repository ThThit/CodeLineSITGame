import { useEffect, useState } from "react";
import { historyIndex, pages, type Screen } from "@/types/navigation";
import { PageNavigator } from "@/components/dev/PageNavigator";
import { DemoIndex } from "@/features/demo/DemoIndex";
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

/** `#game`, `#lobby`, … opens that screen directly, handy when presenting the demo. */
function screenFromHash(): Screen {
  const hash = window.location.hash.slice(1);
  if (hash === "demo") return "demo";
  return pages.find((p) => p.screen === hash)?.screen ?? "demo";
}

function renderScreen(screen: Screen, go: (next: Screen) => void) {
  switch (screen) {
    case "demo":
      return <DemoIndex go={go} />;
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

export default function App() {
  const [screen, setScreen] = useState<Screen>(screenFromHash);

  // Browser Back/Forward (and typing a #hash) move between screens.
  useEffect(() => {
    if (window.history.state === null) {
      window.history.replaceState({ idx: 0 }, "", `#${screenFromHash()}`);
    }
    const sync = () => {
      setScreen(screenFromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const go = (next: Screen) => {
    if (next === screen) return;
    window.history.pushState({ idx: historyIndex() + 1 }, "", `#${next}`);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* key: remount on every visit so timers and game state start fresh */}
      <div key={screen}>{renderScreen(screen, go)}</div>
      <PageNavigator current={screen} go={go} />
    </>
  );
}
