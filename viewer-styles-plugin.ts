/**
 * viewer-styles-plugin — serve safestyles DIRECTLY from source. No copies.
 *
 * /styles/<impl>/components.css → safestyles core/structure.css +
 * implementations/<impl>/paint.css, flattened on request. Dev: middleware.
 * Build: emitted as assets. Replaces the per-viewer public/styles snapshots
 * that drifted from the source (caught 2026-06-12).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const STYLES_ROOT = resolve(__dirname, "../safestyles");
const IMPLS_DIR = join(STYLES_ROOT, "implementations");

function implementations(): string[] {
  return readdirSync(IMPLS_DIR, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
}

function flatten(impl: string): string | null {
  const paintPath = join(IMPLS_DIR, impl, "paint.css");
  if (!existsSync(paintPath)) return null;
  const core = readFileSync(join(STYLES_ROOT, "core/structure.css"), "utf-8");
  const paint = readFileSync(paintPath, "utf-8");
  return `/* served from safestyles source: core/structure.css + implementations/${impl}/paint.css */\n${core}\n\n/* ======== paint (${impl}) ======== */\n${paint}`;
}

export function viewerStyles() {
  return {
    name: "viewer-safestyles",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // Dev verdict sink — viewers/gallery POST their render verdict here
        // (same contract as safeapp's report_render → runtime/render.json).
        if (req.method === "POST" && req.url === "/__verdict") {
          let body = "";
          req.on("data", (c: any) => { body += c; });
          req.on("end", () => {
            try {
              const { mkdirSync, writeFileSync } = require("node:fs");
              mkdirSync(join(process.cwd(), "runtime"), { recursive: true });
              writeFileSync(join(process.cwd(), "runtime/render.json"), body + "\n");
            } catch { /* verdict is best-effort in dev */ }
            res.statusCode = 204;
            res.end();
          });
          return;
        }
        const m = req.url?.match(/^\/styles\/([a-z-]+)\/(components|nav)\.css/);
        if (!m) return next();
        const css = m[2] === "nav"
          ? "/* nav rules live in components.css (core/structure.css) */\n"
          : flatten(m[1]);
        if (css == null) return next();
        res.setHeader("Content-Type", "text/css");
        res.end(css);
      });
    },
    generateBundle(this: any) {
      for (const impl of implementations()) {
        const css = flatten(impl);
        if (css == null) continue;
        this.emitFile({ type: "asset", fileName: `styles/${impl}/components.css`, source: css });
        this.emitFile({ type: "asset", fileName: `styles/${impl}/nav.css`, source: "/* nav rules live in components.css */\n" });
      }
    },
  };
}
