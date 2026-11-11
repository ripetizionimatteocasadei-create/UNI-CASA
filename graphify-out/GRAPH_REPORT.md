# Graph Report - UNI-CASA  (2026-11-11)

## Corpus Check
- 14 files · ~9,939 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 132 nodes · 218 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1eb176ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.yml
- store.js
- runQuiz
- steps
- app.js
- steps
- CLAUDE.md
- widgets.js
- Uni-Casa

## God Nodes (most connected - your core abstractions)
1. `runQuiz()` - 13 edges
2. `exam()` - 8 edges
3. `save()` - 8 edges
4. `renderMath()` - 8 edges
5. `loadAvailable()` - 8 edges
6. `track()` - 7 edges
7. `lesson()` - 7 edges
8. `loadModule()` - 7 edges
9. `moduleProgress()` - 6 edges
10. `module_()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `finish()` --indirect_call--> `exam()`  [INFERRED]
  js/quiz.js → js/app.js
- `lesson()` --calls--> `runQuiz()`  [EXTRACTED]
  js/app.js → js/quiz.js
- `lesson()` --calls--> `renderMath()`  [EXTRACTED]
  js/app.js → js/util.js
- `exam()` --calls--> `runQuiz()`  [EXTRACTED]
  js/app.js → js/quiz.js
- `review()` --calls--> `runQuiz()`  [EXTRACTED]
  js/app.js → js/quiz.js

## Import Cycles
- None detected.

## Communities (10 total, 3 thin omitted)

### Community 0 - "pages.yml"
Cohesion: 0.15
Nodes (12): concurrency, cancel-in-progress, group, name, on, push, workflow_dispatch, permissions (+4 more)

### Community 1 - "store.js"
Cohesion: 0.11
Nodes (20): CONFIG, emit(), empty(), initAuth(), INTERVALS, listeners, load(), merge() (+12 more)

### Community 2 - "runQuiz"
Cohesion: 0.38
Nodes (11): isOk(), parseNum(), prepare(), runQuiz(), finish(), next(), show(), submit() (+3 more)

### Community 3 - "steps"
Cohesion: 0.18
Nodes (11): environment, runs-on, steps, name, url, jobs, deploy, id (+3 more)

### Community 4 - "app.js"
Cohesion: 0.17
Nodes (27): account(), blockHtml(), exam(), home(), lesson(), lessonDone(), module_(), moduleProgress() (+19 more)

### Community 5 - "steps"
Cohesion: 0.12
Nodes (16): jobs, update, name, on, push, permissions, contents, branches (+8 more)

### Community 10 - "Uni-Casa"
Cohesion: 0.29
Nodes (6): Aggiungere contenuti, Avvio in locale, Graphify (mappa del codice per Claude), Login e salvataggio online (Supabase), Pubblicazione su GitHub Pages, Uni-Casa

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runQuiz()` connect `runQuiz` to `app.js`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `exam()` (e.g. with `app.js` and `finish()`) actually correct?**
  _`exam()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `store.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._
- **Why does `jobs` connect `steps` to `pages.yml`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._