// The Self-Checkout Is Judging You — entry program.
// Writes one funny line in the voice of a smug self-checkout machine
// (<=200 chars) to /output/entry.txt. The field leans on yoghurt and the
// bagging area; this one reads the basket instead: one energy drink, one
// instant noodle, 3 a.m. — the machine has seen the shopper's whole week.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const MAX_CHARS = 200;

const BASKET = ["One energy drink", "one instant noodle", "3 a.m"];
const VERDICT = "I have seen your whole week in this basket.";

function composeRemark(): string {
  const basket = BASKET.slice(0, -1).join(", ") + ", and " + BASKET[BASKET.length - 1];
  return `${basket}. ${VERDICT}`;
}

function checkRemark(text: string): void {
  const line = text.trim();
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`remark fails the 1-${MAX_CHARS} character gate`);
  }
  if (line.includes("\n")) {
    throw new Error("remark must be a single line");
  }
  // The machine's voice: it names the basket, then passes its verdict.
  if (!/energy drink/.test(line) || !/whole week/.test(line)) {
    throw new Error("remark must keep the basket and the verdict");
  }
  // Modal guard: no yoghurt, no bagging area, no dignity-in-the-bagging-area.
  if (/yoghurt|bagging area|dignity/i.test(line)) {
    throw new Error("remark must avoid the yoghurt / bagging-area modal");
  }
}

async function run(): Promise<void> {
  const line = composeRemark();
  checkRemark(line);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  await writeFile(target, new TextEncoder().encode(line));
  console.log(`wrote ${[...line].length} chars to ${target}`);
}

await run();
