/** Entrypoint: boot the A2A gateway from environment config. */
import "dotenv/config";
import { loadConfig } from "./config.js";
import { buildGateway } from "./server/server.js";

async function main(): Promise<void> {
  const cfg = loadConfig();
  const { app, registry } = await buildGateway(cfg);

  if (!cfg.gatewayToken) {
    console.warn(
      "⚠️  A2A_GATEWAY_TOKEN is unset — gateway is running in OPEN mode. " +
        "Set a token before exposing this beyond localhost.",
    );
  }

  app.listen(cfg.port, () => {
    console.log(
      `A2A gateway up on ${cfg.publicBaseUrl} (port ${cfg.port}) — ` +
        `${registry.size()} agents, backend=${cfg.backend}`,
    );
    console.log(`Directory: ${cfg.publicBaseUrl}/.well-known/agents.json`);
  });
}

main().catch((err) => {
  console.error("Fatal boot error:", err);
  process.exitCode = 1;
});
