import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

const securedContentRoot = path.join(process.cwd(), "assets", "secured-content");

const noteSources: Record<string, string> = {
  "extrema-integral-functions": "extrema-of-integral-defined-functions.html",
};

const simulationSources: Record<string, string> = {
  "extrema-integral-functions": "extrema-of-integral-defined-functions.sim.html",
};

function stripTags(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function sourcePath(fileName: string) {
  const resolved = path.resolve(securedContentRoot, fileName);
  if (!resolved.startsWith(`${path.resolve(securedContentRoot)}${path.sep}`)) {
    throw new Error("Secured content path escaped its root.");
  }
  return resolved;
}

async function readSource(fileName: string) {
  return readFile(sourcePath(fileName), "utf8");
}

function extractNoteSections(source: string) {
  const style = source.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
  const main = source.match(/<main[^>]*class=["']page["'][^>]*>([\s\S]*?)<div class=["']sim-launch["']/i)?.[1];
  if (!main) throw new Error("The secured note does not contain the expected page body.");

  const starts = [...main.matchAll(/<h2\b/gi)].map((match) => match.index ?? 0);
  if (!starts.length) throw new Error("The secured note has no section headings.");

  return {
    style,
    sections: starts.map((start, index) => {
      const sectionStart = index === 0 ? 0 : start;
      const sectionEnd = starts[index + 1] ?? main.length;
      const html = main.slice(sectionStart, sectionEnd).replace(/\son\w+\s*=\s*(["']).*?\1/gi, "");
      const heading = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? `Section ${index + 1}`;
      return { heading: stripTags(heading).replace(/^\d+\s*/, ""), html };
    }),
  };
}

export async function getSecuredNoteManifest(slug: string) {
  const fileName = noteSources[slug];
  if (!fileName) return null;
  const note = extractNoteSections(await readSource(fileName));
  return { slug, chunkCount: note.sections.length, headings: note.sections.map((section) => section.heading) };
}

function noteRuntime(index: number) {
  return `
<script>
(() => {
  const chunkIndex = ${index};
  const sendHeight = () => parent.postMessage({ type: "orange-note-height", chunkIndex, height: Math.ceil(document.documentElement.scrollHeight) }, "*");
  addEventListener("load", sendHeight);
  new ResizeObserver(sendHeight).observe(document.body);
  document.addEventListener("click", (event) => {
    const option = event.target.closest("button.opt");
    if (option) {
      const checkpoint = option.closest(".cp");
      checkpoint.querySelectorAll("button.opt").forEach((button) => button.classList.remove("right", "wrong"));
      const correct = option.hasAttribute("data-ok");
      option.classList.add(correct ? "right" : "wrong");
      const feedback = checkpoint.querySelector(".fb");
      if (feedback) {
        feedback.textContent = correct ? "Correct — that sign or derivative condition identifies the extremum." : "Not yet — compare the sign immediately before and after the candidate point.";
        feedback.className = "fb " + (correct ? "ok" : "no");
      }
      sendHeight();
    }
    const check = event.target.closest("button.check");
    if (check) {
      const input = document.getElementById(check.dataset.target || "");
      const answer = Number(check.dataset.ans);
      const tolerance = Number(check.dataset.tol || 0.01);
      const value = Number(input?.value);
      const feedback = check.closest(".cp")?.querySelector(".fb");
      const correct = Number.isFinite(value) && Math.abs(value - answer) <= tolerance;
      if (feedback) {
        feedback.textContent = correct ? "Correct." : "Check the derivative and the direction of its sign change.";
        feedback.className = "fb " + (correct ? "ok" : "no");
      }
      sendHeight();
    }
  });
})();
</script>`;
}

export async function renderSecuredNoteChunk(slug: string, index: number) {
  const fileName = noteSources[slug];
  if (!fileName) return null;
  const note = extractNoteSections(await readSource(fileName));
  const section = note.sections[index];
  if (!section) return null;

  const style = note.style
    .replace(/--head:[^;]+;/, "--head:'Fustat','DM Sans','Segoe UI',sans-serif;")
    .replace(/--read:[^;]+;/, "--read:'Fustat','DM Sans','Segoe UI',sans-serif;");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${section.heading}</title>
<style>${style}
html,body{background:#161418}.page{max-width:760px;padding:24px 12px 56px}body{background-image:none}h2{margin-top:28px}.sim-launch,.sim-overlay{display:none!important}
@media(max-width:560px){body{font-size:16px}.page{padding:18px 4px 42px}h1.title{font-size:30px}.lede{font-size:17px}.eq,.chain{margin-left:0}}
</style>
</head>
<body><main class="page">${section.html}</main>${noteRuntime(index)}</body>
</html>`;
}

export async function renderSecuredSimulation(slug: string) {
  const fileName = simulationSources[slug];
  if (!fileName) return null;
  const source = await readSource(fileName);
  return source
    .replace(/<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>\s*/gi, "")
    .replace(/<\/head>/i, `<style>
:root{--head:'Fustat','DM Sans','Segoe UI',sans-serif;--read:'Fustat','DM Sans','Segoe UI',sans-serif}
.sim-bar{display:none!important}
@media(max-width:760px){.sim-head{padding:8px 12px}.sim-head .what,.sim-head .explains{font-size:12px}.sim-body{grid-template-columns:1fr;grid-template-rows:minmax(190px,42vh) 1fr}.sim-controls{grid-row:2;max-height:none;border-right:0;border-top:1px solid var(--steel);padding:12px}.sim-stage{grid-row:1}.expl{display:none}}
</style></head>`)
    .replace(/href=["']extrema-of-integral-defined-functions\.html["']/i, `href="/notes/mathematics/calculus/integration" target="_top"`);
}
