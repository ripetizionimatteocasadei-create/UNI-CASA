## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Stile dei contenuti didattici (obbligatorio)

L'utente è un fisico triennale con competenze di programmazione, ma sull'AI parte da zero e le formule compresse non gli servono.
- Dai per scontato che non sappia nulla: spiega ogni simbolo con un blocco `decode` ("Come si legge") la prima volta che compare.
- Prima un esempio con numeri veri (`ex`), poi la formula generale. Mai il contrario.
- Spiega il «perché» di ogni passaggio e non saltare passaggi aritmetici.
- Niente argomenti avanzati fuori posto (es. LoRA nel modulo di matematica): rimandali al modulo giusto.
- Ogni lezione: widget interattivo se aiuta, quiz con spiegazione di ogni risposta, box «Perché ti serve» orientato ai suoi progetti.
- Dopo ogni modifica ai contenuti: verifica rendering con Playwright e controlla che le risposte numeriche dei quiz siano corrette a mano.
