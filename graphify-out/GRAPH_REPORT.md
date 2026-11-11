# Graph Report - UNI-CASA  (2026-11-11)

## Corpus Check
- 11 files · ~6,344 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 111 nodes · 216 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `022a8225`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.yml
- store.js
- runQuiz
- steps
- lesson
- app.js
- account
- module_
- emit
- widgets.js
- Uni-Casa
- save
- exam
- review

## God Nodes (most connected - your core abstractions)
1. `runQuiz()` - 13 edges
2. `exam()` - 9 edges
3. `lesson()` - 8 edges
4. `account()` - 8 edges
5. `loadAvailable()` - 8 edges
6. `save()` - 8 edges
7. `renderMath()` - 8 edges
8. `moduleProgress()` - 7 edges
9. `track()` - 7 edges
10. `module_()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `finish()` --indirect_call--> `exam()`  [INFERRED]
  js/quiz.js → js/app.js
- `home()` --calls--> `loadAvailable()`  [EXTRACTED]
  js/app.js → js/catalog.js
- `home()` --calls--> `dueIds()`  [EXTRACTED]
  js/app.js → js/store.js
- `track()` --calls--> `findTrack()`  [EXTRACTED]
  js/app.js → js/catalog.js
- `track()` --calls--> `loadModule()`  [EXTRACTED]
  js/app.js → js/catalog.js

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "pages.yml"
Cohesion: 0.15
Nodes (12): concurrency, cancel-in-progress, group, name, on, push, workflow_dispatch, permissions (+4 more)

### Community 1 - "store.js"
Cohesion: 0.22
Nodes (9): CONFIG, empty(), INTERVALS, listeners, load(), merge(), newest(), resetAll() (+1 more)

### Community 2 - "runQuiz"
Cohesion: 0.38
Nodes (11): isOk(), parseNum(), prepare(), runQuiz(), finish(), next(), show(), submit() (+3 more)

### Community 3 - "steps"
Cohesion: 0.18
Nodes (11): environment, runs-on, steps, name, url, jobs, deploy, id (+3 more)

### Community 4 - "lesson"
Cohesion: 0.29
Nodes (9): blockHtml(), lesson(), allModules(), cache, findModule(), findTrack(), loadAvailable(), loadModule() (+1 more)

### Community 5 - "app.js"
Cohesion: 0.36
Nodes (6): home(), ring(), route(), routes, view, esc()

### Community 6 - "account"
Cohesion: 0.29
Nodes (8): account(), updateChrome(), getSyncStatus(), getUser(), signIn(), signOut(), signUp(), supabaseConfigured()

### Community 7 - "module_"
Cohesion: 0.60
Nodes (6): lessonDone(), module_(), moduleProgress(), stats(), getState(), voto()

### Community 8 - "emit"
Cohesion: 0.53
Nodes (5): emit(), initAuth(), pull(), push(), setUser()

### Community 10 - "Uni-Casa"
Cohesion: 0.33
Nodes (5): Aggiungere contenuti, Avvio in locale, Login e salvataggio online (Supabase), Pubblicazione su GitHub Pages, Uni-Casa

### Community 11 - "save"
Cohesion: 0.40
Nodes (5): persist(), recordExam(), recordLesson(), save(), scheduleSync()

### Community 12 - "exam"
Cohesion: 0.67
Nodes (4): exam(), notFound(), pct(), track()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runQuiz()` connect `runQuiz` to `lesson`, `review`, `exam`, `app.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `exam()` (e.g. with `app.js` and `finish()`) actually correct?**
  _`exam()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Why does `jobs` connect `steps` to `pages.yml`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._