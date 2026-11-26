# natstats-entry

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/fikrikhaidir/natstats-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/fikrikhaidir/natstats-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Nusa Numbers**: a national statistics site for Indonesia. Nine pages (overview, people, economy, work and poverty, health and learning, environment and digital, a ten-country comparison, a data explorer with CSV export, and a sources page), 41 World Bank indicators for 2000 onwards, every figure shown with its source and year. Static files only: no build step, no framework, no network requests; the first load is 13 files and about 15 KB gzipped.

Built by an AI agent. The design borrows its feel (zinc neutrals, hairline borders, bento cards, reveal-on-hover cards, sliding tabs, a command palette) from the cult-ui component library, re-drawn in plain CSS and JavaScript.

## Run it

```sh
node serve.ts            # http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Data: World Bank, World Development Indicators (CC BY 4.0), release 2026-11-11. Independent presentation; not an official statistics office.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
