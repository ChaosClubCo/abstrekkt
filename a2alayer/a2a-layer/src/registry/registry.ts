/**
 * In-memory registry that indexes every managed agent by slug, lane, and skill
 * tags, and produces the A2A agent directory served at /.well-known/agents.json.
 */
import { readFile } from "node:fs/promises";
import type { AgentCard } from "@a2a-js/sdk";
import type { AgentDef, Lane } from "../types.js";
import { parseAgents } from "./parseAgents.js";
import { buildAgentCard, PROTOCOL_VERSION } from "./buildAgentCard.js";

export interface RegistryEntry {
  def: AgentDef;
  card: AgentCard;
}

/** A minimal record in the public agent directory. */
export interface DirectoryEntry {
  name: string;
  slug: string;
  description: string;
  lane: Lane;
  url: string;
  cardUrl: string;
  skillTags: string[];
}

export class AgentRegistry {
  private readonly bySlug = new Map<string, RegistryEntry>();

  constructor(entries: RegistryEntry[]) {
    for (const e of entries) {
      if (this.bySlug.has(e.def.slug)) {
        throw new Error(`Duplicate agent slug in registry: ${e.def.slug}`);
      }
      this.bySlug.set(e.def.slug, e);
    }
  }

  /** Build a registry from the markdown source file. */
  static async fromSource(
    sourcePath: string,
    publicBaseUrl: string,
    protocolVersion: string = PROTOCOL_VERSION,
  ): Promise<AgentRegistry> {
    const md = await readFile(sourcePath, "utf8");
    const defs = parseAgents(md);
    const entries = defs.map((def) => ({
      def,
      card: buildAgentCard(def, { publicBaseUrl, protocolVersion }),
    }));
    return new AgentRegistry(entries);
  }

  get(slug: string): RegistryEntry | undefined {
    return this.bySlug.get(slug);
  }

  all(): RegistryEntry[] {
    return [...this.bySlug.values()];
  }

  size(): number {
    return this.bySlug.size;
  }

  byLane(lane: Lane): RegistryEntry[] {
    return this.all().filter((e) => e.def.lane === lane);
  }

  /**
   * Rank agents by overlap between the query terms and each agent's
   * name / description / skill tags. Returns highest-scoring first.
   */
  searchSkills(query: string, limit = 5): RegistryEntry[] {
    const terms = query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2);
    if (terms.length === 0) return [];

    const scored = this.all().map((entry) => {
      const skill = entry.card.skills[0];
      const haystack = [
        entry.def.name,
        entry.def.description,
        ...(skill ? skill.tags : []),
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (haystack.includes(term)) score += 1;
      }
      return { entry, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.entry);
  }

  /** The public A2A agent directory (served at /.well-known/agents.json). */
  directory(): { protocolVersion: string; count: number; agents: DirectoryEntry[] } {
    const agents = this.all().map<DirectoryEntry>(({ def, card }) => ({
      name: def.name,
      slug: def.slug,
      description: def.description,
      lane: def.lane,
      url: card.url,
      cardUrl: `${card.url}/.well-known/agent-card.json`,
      skillTags: card.skills[0]?.tags ?? [],
    }));
    return {
      protocolVersion: this.all()[0]?.card.protocolVersion ?? PROTOCOL_VERSION,
      count: agents.length,
      agents,
    };
  }
}
