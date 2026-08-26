/**
 * Parse Kyle's `kyle-40-agents.md` source-of-truth into normalized AgentDef[].
 *
 * The source is Markdown with one fenced ```yaml block per agent, grouped under
 * `## GROUP N — <title>` headings and `### NN · <name>` sub-headings. We extract
 * the YAML, validate the fields we depend on, and derive slug + lane.
 */
import { load as parseYaml } from "js-yaml";
import type { AgentDef, Lane, McpBinding } from "../types.js";

/** Map a source group heading to a work-lane. */
export function laneForGroup(group: string): Lane {
  // Only the MSP Service Desk group is Intinc work; everything else is Kyle's
  // personal automation stack. FREELANCE has no agents in the current source.
  if (/service desk|intinc|msp/i.test(group)) return "INTINC";
  return "PERSONAL";
}

/** Deterministic URL-safe slug from an agent name. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface RawAgentYaml {
  name?: unknown;
  description?: unknown;
  model?: unknown;
  system?: unknown;
  mcp_servers?: unknown;
  tools?: unknown;
  skills?: unknown;
}

function coerceMcp(raw: unknown): McpBinding[] {
  if (!Array.isArray(raw)) return [];
  const out: McpBinding[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (typeof r.name !== "string" || typeof r.url !== "string") continue;
    out.push({
      name: r.name,
      type: typeof r.type === "string" ? r.type : "url",
      url: r.url,
      permission: "unknown",
    });
  }
  return out;
}

/**
 * Merge per-tool permission policies (from the `tools:` block) onto the
 * matching MCP binding so the card can advertise the agent's write posture.
 */
function applyToolPermissions(mcp: McpBinding[], toolsRaw: unknown): void {
  if (!Array.isArray(toolsRaw)) return;
  for (const t of toolsRaw) {
    if (!t || typeof t !== "object") continue;
    const r = t as Record<string, unknown>;
    const serverName = r.mcp_server_name;
    if (typeof serverName !== "string") continue;
    const cfg = r.default_config as Record<string, unknown> | undefined;
    const policy = cfg?.permission_policy as Record<string, unknown> | undefined;
    const type = policy?.type;
    const binding = mcp.find((m) => m.name === serverName);
    if (binding && typeof type === "string") {
      if (type === "always_allow" || type === "always_ask" || type === "never") {
        binding.permission = type;
      }
    }
  }
}

const YAML_BLOCK = /```yaml\s*\n([\s\S]*?)```/g;
const GROUP_HEADING = /^##\s+(GROUP\s+\d+[^\n]*)$/gim;
const ORDINAL_HEADING = /###\s+(\d{2})\s+·/g;

/** Build an ordered index of [charOffset, groupTitle] for group headings. */
function groupIndex(md: string): Array<[number, string]> {
  const idx: Array<[number, string]> = [];
  let m: RegExpExecArray | null;
  GROUP_HEADING.lastIndex = 0;
  while ((m = GROUP_HEADING.exec(md)) !== null) {
    idx.push([m.index, m[1]!.trim()]);
  }
  return idx;
}

function groupAtOffset(idx: Array<[number, string]>, offset: number): string {
  let current = "Ungrouped";
  for (const [pos, title] of idx) {
    if (pos <= offset) current = title;
    else break;
  }
  return current;
}

/** Build an ordered index of [charOffset, ordinal] for `### NN ·` headings. */
function ordinalIndex(md: string): Array<[number, string]> {
  const idx: Array<[number, string]> = [];
  let m: RegExpExecArray | null;
  ORDINAL_HEADING.lastIndex = 0;
  while ((m = ORDINAL_HEADING.exec(md)) !== null) {
    idx.push([m.index, m[1]!]);
  }
  return idx;
}

function ordinalBeforeOffset(idx: Array<[number, string]>, offset: number): string {
  let current = "00";
  for (const [pos, ord] of idx) {
    if (pos <= offset) current = ord;
    else break;
  }
  return current;
}

/**
 * Parse the full markdown source into AgentDefs.
 * @throws if a YAML block is missing a required field (name/model/system).
 */
export function parseAgents(markdown: string): AgentDef[] {
  const groups = groupIndex(markdown);
  const ordinals = ordinalIndex(markdown);
  const defs: AgentDef[] = [];
  const seenSlugs = new Set<string>();

  let m: RegExpExecArray | null;
  YAML_BLOCK.lastIndex = 0;
  while ((m = YAML_BLOCK.exec(markdown)) !== null) {
    const block = m[1]!;
    let doc: RawAgentYaml;
    try {
      doc = (parseYaml(block) as RawAgentYaml) ?? {};
    } catch (err) {
      throw new Error(
        `Failed to parse a YAML agent block near offset ${m.index}: ${(err as Error).message}`,
      );
    }
    // Only treat blocks that look like an agent definition (have name+model+system).
    if (
      typeof doc.name !== "string" ||
      typeof doc.model !== "string" ||
      typeof doc.system !== "string"
    ) {
      continue;
    }

    const group = groupAtOffset(groups, m.index);
    const ordinal = ordinalBeforeOffset(ordinals, m.index);
    const mcp = coerceMcp(doc.mcp_servers);
    applyToolPermissions(mcp, doc.tools);

    let slug = slugify(doc.name);
    if (seenSlugs.has(slug)) slug = `${slug}-${ordinal}`;
    seenSlugs.add(slug);

    defs.push({
      slug,
      ordinal,
      group,
      name: doc.name,
      description:
        typeof doc.description === "string" ? doc.description.trim() : doc.name,
      model: doc.model,
      system: doc.system,
      mcp,
      skills: Array.isArray(doc.skills)
        ? doc.skills.filter((s): s is string => typeof s === "string")
        : [],
      lane: laneForGroup(group),
    });
  }

  if (defs.length === 0) {
    throw new Error("No agent YAML blocks found in the provided markdown source.");
  }
  return defs;
}
