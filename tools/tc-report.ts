/**
 * Test-case coverage report.
 *
 *   npm run tc:report            summary + consistency checks
 *   npm run tc:report -- --list  also list every case
 *
 * Reads frontmatter from specs/test-cases/**\/*.md and test titles from
 * test/e2e/**\/*.spec.ts. Exits with code 1 if any consistency problem is found.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const CASES_DIR = "specs/test-cases";
const TESTS_DIR = "test/e2e";

const STATUSES = ["draft", "ready", "automated", "blocked", "manual-only"] as const;
const TYPES = ["smoke", "regression"] as const;
const PRIORITIES = ["high", "medium", "low"] as const;
const REQUIRED = ["id", "title", "area", "type", "priority", "status"] as const;
const ID_RE = /^BKS-[A-Z]+-\d{3}$/;
// Manual case title (user perspective): "Verify that <outcome> when|if <action/condition>"
const CASE_TITLE_RE = /^Verify that \S.*\s(when|if)\s+\S/;
// Automated it() title after ID and tags (SUT perspective): "should <app behaviour> when|if <...>"
const TEST_TITLE_RE = /^should \S.*\s(when|if)\s+\S/;

type Fields = Record<string, string>;
interface TestCase {
  file: string;
  fields: Fields;
}
interface TestRef {
  id: string;
  file: string;
  tags: string[];
  text: string;
}

function walk(dir: string, filter: (f: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p, filter) : filter(p) ? [p] : [];
  });
}

function parseFrontmatter(text: string): Fields | undefined {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return undefined;
  const fields: Fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([\w-]+):\s*(.*?)\s*(#.*)?$/.exec(line);
    if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return fields;
}

function loadCases(): { cases: TestCase[]; problems: string[] } {
  const problems: string[] = [];
  const cases: TestCase[] = [];
  const files = walk(CASES_DIR, (f) => f.endsWith(".md") && basename(f) !== "README.md");
  for (const file of files) {
    const fields = parseFrontmatter(readFileSync(file, "utf8"));
    if (!fields) {
      problems.push(`${file}: no frontmatter`);
      continue;
    }
    cases.push({ file, fields });
  }
  return { cases, problems };
}

function loadTests(): TestRef[] {
  const refs: TestRef[] = [];
  const titleRe = /\bit(?:\.only|\.skip)?\(\s*(["'`])(BKS-[A-Z]+-\d{3})\b(.*?)\1/g;
  for (const file of walk(TESTS_DIR, (f) => f.endsWith(".ts"))) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(titleRe)) {
      refs.push({
        id: m[2],
        file,
        tags: [...m[3].matchAll(/@([\w-]+)/g)].map((t) => t[1]),
        text: m[3].replace(/@[\w-]+/g, "").replace(/\s+/g, " ").trim(),
      });
    }
  }
  return refs;
}

function check(cases: TestCase[], tests: TestRef[]): string[] {
  const problems: string[] = [];
  const seen = new Map<string, string>();
  const testsById = new Map<string, TestRef[]>();
  for (const t of tests) testsById.set(t.id, [...(testsById.get(t.id) ?? []), t]);

  for (const { file, fields: f } of cases) {
    const where = `${file}`;
    for (const key of REQUIRED) if (!f[key]) problems.push(`${where}: missing "${key}"`);
    const id = f.id ?? "";
    if (id && !ID_RE.test(id)) problems.push(`${where}: id "${id}" doesn't match BKS-<AREA>-NNN`);
    if (id && seen.has(id)) problems.push(`${where}: duplicate id ${id} (also in ${seen.get(id)})`);
    if (id) seen.set(id, file);
    if (id && !basename(file).startsWith(`${id}-`)) problems.push(`${where}: file name should start with "${id}-"`);
    if (f.area && basename(dirname(file)) !== f.area)
      problems.push(`${where}: area "${f.area}" doesn't match folder "${basename(dirname(file))}"`);
    if (f.status && !STATUSES.includes(f.status as never)) problems.push(`${where}: invalid status "${f.status}"`);
    if (f.type && !TYPES.includes(f.type as never)) problems.push(`${where}: invalid type "${f.type}"`);
    if (f.priority && !PRIORITIES.includes(f.priority as never))
      problems.push(`${where}: invalid priority "${f.priority}"`);
    if (f.title && !CASE_TITLE_RE.test(f.title))
      problems.push(`${where}: title should follow "Verify that <outcome> when|if <action/condition>"`);
    if ((f.status === "blocked" || f.status === "manual-only") && !f.blocked_reason)
      problems.push(`${where}: status ${f.status} needs "blocked_reason"`);

    const refs = testsById.get(id) ?? [];
    if (f.status === "automated") {
      if (!f.automated_in) problems.push(`${where}: automated but "automated_in" is empty`);
      else if (!existsSync(f.automated_in)) problems.push(`${where}: automated_in "${f.automated_in}" does not exist`);
      else if (!refs.some((r) => relative(".", r.file) === relative(".", f.automated_in)))
        problems.push(`${where}: ${id} not found in ${f.automated_in}`);
    } else if (refs.length) {
      problems.push(`${where}: status "${f.status}" but test exists in ${refs.map((r) => r.file).join(", ")}`);
    }
    for (const r of refs) {
      const missing = [f.type, f.area].filter((t) => t && !r.tags.includes(t));
      if (missing.length) problems.push(`${r.file}: ${id} title is missing tags ${missing.map((t) => "@" + t).join(" ")}`);
    }
    if (refs.length > 1) problems.push(`${id}: automated more than once (${refs.map((r) => r.file).join(", ")})`);
  }

  for (const t of tests) if (!seen.has(t.id)) problems.push(`${t.file}: test ${t.id} has no test-case file`);
  for (const t of tests)
    if (!TEST_TITLE_RE.test(t.text))
      problems.push(`${t.file}: ${t.id} title should read "<ID> @<type> @<area> should <app behaviour> when|if <...>"`);
  return problems;
}

function pct(n: number, d: number): string {
  return d ? `${Math.round((n / d) * 100)}%` : "—";
}

function table(rows: string[][], alignLeft = false): string {
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  const fmt = (r: string[]) => r.map((c, i) => (i === 0 || alignLeft ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join("  ").trimEnd();
  return [fmt(rows[0]), widths.map((w) => "-".repeat(w)).join("  "), ...rows.slice(1).map(fmt)].join("\n");
}

function report(): number {
  const { cases, problems: parseProblems } = loadCases();
  const tests = loadTests();
  const problems = [...parseProblems, ...check(cases, tests)];

  const byStatus = (list: TestCase[], s: string) => list.filter((c) => c.fields.status === s).length;
  const automatable = (list: TestCase[]) => list.filter((c) => c.fields.status !== "manual-only").length;

  // Area × status
  const areas = [...new Set(cases.map((c) => c.fields.area ?? "?"))].sort();
  const rows: string[][] = [["area", ...STATUSES, "total", "automated %"]];
  for (const area of [...areas, "TOTAL"]) {
    const list = area === "TOTAL" ? cases : cases.filter((c) => (c.fields.area ?? "?") === area);
    rows.push([
      area,
      ...STATUSES.map((s) => String(byStatus(list, s))),
      String(list.length),
      pct(byStatus(list, "automated"), automatable(list)),
    ]);
  }
  console.log(`\nTest cases by area and status (${CASES_DIR})\n`);
  console.log(table(rows));

  // By type
  const typeRows: string[][] = [["type", "total", "automated", "automated %"]];
  for (const type of TYPES) {
    const list = cases.filter((c) => c.fields.type === type);
    typeRows.push([type, String(list.length), String(byStatus(list, "automated")), pct(byStatus(list, "automated"), automatable(list))]);
  }
  console.log(`\nBy type\n`);
  console.log(table(typeRows));
  console.log(`\nautomated % excludes manual-only cases.`);

  if (process.argv.includes("--list")) {
    const sorted = [...cases].sort((a, b) => (a.fields.id ?? "").localeCompare(b.fields.id ?? ""));
    console.log(`\nAll cases\n`);
    console.log(
      table([
        ["id", "status", "type", "priority", "title"],
        ...sorted.map((c) => [c.fields.id ?? "?", c.fields.status ?? "?", c.fields.type ?? "?", c.fields.priority ?? "?", c.fields.title ?? ""]),
      ], true),
    );
  }

  if (problems.length) {
    console.log(`\n✗ ${problems.length} consistency problem(s):`);
    for (const p of problems) console.log(`  - ${p}`);
    return 1;
  }
  console.log(`\n✓ No consistency problems (${cases.length} cases, ${tests.length} linked tests).`);
  return 0;
}

process.exitCode = report();
