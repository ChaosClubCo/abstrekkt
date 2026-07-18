/**
 * Generates one A2A Agent Card JSON per managed agent plus the agent directory,
 * written to ./cards. Run: `npm run generate:cards`. Output is deterministic and
 * intended to be committed so card changes are reviewable in diffs.
 */
import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { loadConfig } from "../src/config.js";
import { AgentRegistry } from "../src/registry/registry.js";

async function main(): Promise<void> {
  const cfg = loadConfig();
  const registry = await AgentRegistry.fromSource(cfg.agentsSource, cfg.publicBaseUrl);

  await mkdir("cards", { recursive: true });
  for (const { def, card } of registry.all()) {
    await writeFile(`cards/${def.slug}.json`, `${JSON.stringify(card, null, 2)}\n`, "utf8");
  }
  await writeFile(
    "cards/_directory.json",
    `${JSON.stringify(registry.directory(), null, 2)}\n`,
    "utf8",
  );

  const byLane = new Map<string, number>();
  for (const { def } of registry.all()) {
    byLane.set(def.lane, (byLane.get(def.lane) ?? 0) + 1);
  }
  console.log(`Wrote ${registry.size()} agent cards + directory to ./cards`);
  console.log(
    `Lanes: ${[...byLane.entries()].map(([l, n]) => `${l}=${n}`).join(", ")}`,
  );
}

main().catch((err) => {
  console.error("Card generation failed:", err);
  process.exitCode = 1;
});
