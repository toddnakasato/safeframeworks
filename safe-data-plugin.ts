/**
 * Vite plugin: resolve parquet and csv data files via duckdb.
 *
 * Intercepts imports of .parquet and .csv files. Reads them via duckdb
 * at transform time (Node) and returns JSON rows. The browser never
 * sees parquet or csv — it gets pre-resolved JSON.
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { Plugin } from "vite";

export function safeDataPlugin(): Plugin {
  return {
    name: "safe-data",
    enforce: "pre",

    resolveId(source, importer) {
      if (source.endsWith(".parquet") || source.endsWith(".csv")) {
        // Resolve relative to the importer
        if (importer) {
          const abs = resolve(dirname(importer), source);
          if (existsSync(abs)) return abs;
        }
        return null;
      }
      return null;
    },

    load(id) {
      if (!id.endsWith(".parquet") && !id.endsWith(".csv")) return null;
      if (!existsSync(id)) return null;

      const reader = id.endsWith(".parquet")
        ? `read_parquet('${id}')`
        : `read_csv('${id}', header=true)`;

      try {
        const out = execSync(`duckdb -json -c "SELECT * FROM ${reader}"`, {
          encoding: "utf-8",
          timeout: 10_000,
        }).trim();

        // Validate it's valid JSON
        JSON.parse(out);

        return `export default ${out};`;
      } catch (e: any) {
        console.warn(`[safe-data] failed to read ${id}: ${e.message}`);
        return `export default [];`;
      }
    },
  };
}
