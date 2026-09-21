# Extension Modules (ask #3: "add 5 new modules")

The source asked to extend the engine with 5 modules (it named FlashFusion patterns
and n8n integrations, then "etc."). Specified concretely here — no "etc." placeholders.

## 1. FlashFusion Pattern Module
Recognizes FlashFusion-style artifacts in a conversation (workflow orchestration,
tRPC/Supabase patterns) and extracts them as reusable templates for INT skill packs.

## 2. n8n Workflow Integration Module
Detects automation intent and emits ready-to-import n8n workflow JSON (trigger →
nodes → output), plus a setup note.

## 3. Schema Extraction Module
Finds implied data models in a conversation and emits JSON Schema files (mirrors how
the Base44 package produced onboarding/lifecycle schemas).

## 4. Prompt-Library Module
Harvests reusable prompts from a conversation into an atomic, cross-referenced
library (one file per prompt + an index), with implementation notes.

## 5. Doc-Generator Module
Produces the standard doc set (README, technical-spec, ARCHITECTURE, decision-trees)
from extracted content, following the kit's required-sections format.

## Module contract
Each module implements: `detect(conversation) -> signals`, `extract(signals) ->
artifacts[]`, `validate(artifacts) -> report`. This keeps modules pluggable and
individually testable (mirrors the Universal MCP Server's adapter contract).
