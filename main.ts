// Hand-in program for the Nusa Numbers entry (Node 22, standard library only, no network).
//
// The site itself is the static folder app/ beside this file. This script copies app/ and screenshots/ into the
// output folder (/output in the grader, MAKEFUN_OUTPUT_DIR when run locally) and writes dossier.json, the summary
// the judge reads, using the kit's vendored library. It runs twice in the grader and both runs must produce
// identical bytes, so it writes nothing that depends on the clock or the machine.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

const shots = join(here, 'screenshots');
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(shots)) cpSync(shots, join(out, 'screenshots'), { recursive: true });

// Limits copied from the competition rules: the dossier text is capped at 160 KiB, at most four screenshots of
// 256 KiB each, and app/ at 993 entries and 16 MiB.
const limits = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 };
writeFileSync(join(out, 'dossier.json'), buildDossier(out, limits));
