# CodeLine: Proposed Solution

## 1. Overview
CodeLine is a **gamified, web-based** version of the paper exercise where students put lines of code in the right order. The instructor creates a game from a program. The program's lines are handed out to students at random, and the class places them into a shared code space in real time. Students earn points, climb a leaderboard and track their own progress.

## 2. Problem
- The instructor currently **prints the program and cuts it into strips of paper** for each class. This takes a lot of time and doesn't scale to about 300 students across several sections.
- The paper version has **no scoring, no progress tracking and no record** to share with the department.

## 3. Design principles
- **Fast, accessible, simple:** "back to basics".
- **Fun:** scores, time limits, rewards, penalties and a leaderboard.
- **Original:** not a Blooket clone and not based on any existing tool.
- **Not multiple choice.** That is out of scope.

## 4. Scope

| In scope | Out of scope |
|---|---|
| Web app on mobile, tablet and laptop | Native mobile apps |
| Hosted on the university server, usable on campus only | Access from outside campus |
| Code-line ordering games | Multiple-choice questions |
| Login with university student and instructor accounts | Separate CodeLine sign-up |
| Instructor dashboard and export | Other integrations with university systems |

## 5. Users
- **Instructor:** creates questions, runs sessions, and monitors and exports results.
- **Student:** logs in, joins a session, places code lines and views their own progress.
- **Department:** receives progress reports. It does not use the system directly.

## 6. How a session works
1. The instructor creates or reuses a question: the pseudocode plus the correct code.
2. The instructor sets up a session with its purpose, rounds and per-round settings.
3. Students **log in with their university student account**, then join with the **game code**. The QR code or link fills in the game code for them.
4. The instructor starts the round. The code is split into lines, and **each student gets several lines at random**.
5. Students **drag and drop** their lines into the **shared code space**.
6. The system checks every placement immediately and updates scores and the leaderboard live.
7. The round ends when all lines are placed or the timer runs out.
8. Results are shown. The instructor moves to the next round or ends the session.
9. All results are **saved to the database** and linked to each student's account.

## 7. Game rules

| Rule | Behaviour |
|---|---|
| **Correct placement** | The line locks in place with a **green highlight**. The student **earns points**. |
| **Incorrect placement** | A wrong position counts as incorrect. The line is **rejected** and returned to the student, with a "wrong" notification. A **penalty** applies. |
| **Penalty** | Set by the instructor: a **cooldown** (for example, 10 seconds before the next attempt) or **points deducted**. |
| **Attempts** | Set by the instructor for each round: **unlimited** or a **fixed number**. When a student runs out of attempts on a line, the line is placed in its correct position and **scores 0**. |
| **Time limit** | Set for each round by the instructor, who can **add time** during the game. |
| **Timeout** | No more placements are accepted. The instructor chooses to **reveal the full code** or **leave unplaced lines empty**. |
| **Hints** | The instructor can **send hints** to students who are struggling. |
| **Rewards** | Points and leaderboard rank. |

## 8. Functional requirements

### 8.1 Instructor
- **FR-I1:** Log in with a university instructor account.
- **FR-I2:** Create a question by entering a title and pseudocode, and pasting the correct code into a code-formatted text box.
- **FR-I3:** Preview how a question will be split into lines.
- **FR-I4:** Save, search, edit, duplicate and delete questions in a **question bank**.
- **FR-I5:** Set up a session:
  - a name
  - a purpose: **quiz, activity or participation**
  - one or more **rounds**
- **FR-I6:** Configure each round:
  - questions
  - time limit
  - attempts (limited or unlimited)
  - penalty type
  - timeout behaviour
  - music on or off
- **FR-I7:** Show a lobby with the QR code, link and game code, and see students as they join.
- **FR-I8:** During a session:
  - start the game
  - see the timer, number of placements and live leaderboard
  - **add time** and **send hints**
  - move to the next round
- **FR-I9:** See round results on a leaderboard for **the current round and all rounds**, plus results for each question.
- **FR-I10:** Use a **dashboard** to see student progress across sessions, and **export or send it to the department**.
- **FR-I11:** Look back at past sessions.

### 8.2 Student
- **FR-S1:** Log in with a **university student account**.
- **FR-S2:** Join a session by entering the **game code**. Scanning the QR code or opening the link fills in the code.
- **FR-S3:** Wait in a lobby until the instructor starts the game.
- **FR-S4:** See the timer, pseudocode, shared code space and assigned lines.
- **FR-S5:** Drag and drop lines into positions in the code space.
- **FR-S6:** Get immediate feedback on each placement:
  - **correct:** points earned
  - **incorrect:** penalty and attempts left
  - **time's up**
- **FR-S7:** Retry incorrect lines until attempts run out.
- **FR-S8:** See the leaderboard for **this round and all rounds**, plus their own correct/incorrect results.
- **FR-S9:** See **their own progress** from past sessions, with scores and results.

### 8.3 System
- **FR-SYS1:** Check student and instructor accounts against the university's accounts.
- **FR-SYS2:** Split the code into lines and hand them out at random so every student in the class gets some.
- **FR-SYS3:** Check each placement against the correct order in real time.
- **FR-SYS4:** Calculate scores, apply penalties and track attempts.
- **FR-SYS5:** Update the main display and the leaderboard live.
- **FR-SYS6:** Save all sessions, results and progress to the database, linked to each student's account.

## 9. Non-functional requirements
- **Access:** hosted on the university server and reachable only from the campus network.
- **Security:** only logged-in university accounts can join sessions.
- **Devices:** responsive on mobile, tablet and laptop.
- **Performance:** placements update in real time for a class of up to about 70 students.
- **Usability:** simple and fast, so students can join and play with no instructions.
- **Accessibility:** readable code font, clear colours for correct and incorrect, and the option to turn music off.
- **Data:** results are kept so progress can be tracked over time and reported.

## 10. Screens (wireframes)

### Main display (projected by the instructor)

| Left | Centre | Right |
|---|---|---|
| Pseudocode | Shared code space (correct lines lock in green) | Live leaderboard |

### Instructor
1. **Login:** university instructor account
2. **Home:** new session, question bank, recent sessions, dashboard link
3. **Question bank:** search, new, edit, duplicate, delete
4. **Create/edit question:** title, pseudocode, code box, line preview
5. **Session setup:** name, purpose, rounds, and for each round: questions, time limit, attempts, penalty, timeout behaviour, music
6. **Lobby:** QR code, link, game code, joined students, Start
7. **Live control:** timer, placement count, live leaderboard, Add time, Send hint, Next round, plus the main display above
8. **Round results:** leaderboard for this round or all rounds, results for each question, reveal the full code
9. **Dashboard:** student progress, Export / Send to department

### Student
10. **Login:** university student account
11. **Join:** enter the game code (filled in automatically from the QR code or link)
12. **Waiting lobby**
13. **Game:** timer, pseudocode, shared code space, my lines
14. **Feedback:** correct (points), incorrect (penalty and attempts left), time's up
15. **Leaderboard:** this round / all rounds
16. **My progress:** past sessions, scores, results

---

## Note for the team
- **Game model:** this solution uses a **shared code space** where each student places their own lines live. An earlier draft had each student arrange the whole question and press Submit. Agree on the shared model before you draw the wireframes.
