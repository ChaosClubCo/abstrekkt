# Plugin-Level Anti-Patterns — character-studio

Cross-skill failure patterns that affect the entire character-studio workflow.
Consult this before troubleshooting any persistent generation or consistency issue.

---

## Category 1: Style Lock Violations

These are the most common generation failures. Each conflicts with one or more of the 6 Style Lock constraints.

| Anti-pattern | What happens | Fix |
|---|---|---|
| "White background" explicitly included in user prompt | DALL-E 3 treats this as optional; may render grey or gradient instead | Let Style Lock handle background; never include explicit background instructions in CHARACTER_DESCRIPTION |
| Style name conflict (anime, watercolor, pixel art) | Model averages between styles; output is muddy | Remove competing style names; Style Lock ("Pixar/Disney 3D render style") is always the only style anchor |
| "Photorealistic" or "hyperrealistic" in prompt | Model produces quasi-realistic output; loses cartoon quality | Remove; rephrase physical features as design choices, not photography |
| Dramatic lighting request (sunset, spotlight, rim light) | Overrides soft studio lighting; creates heavy shadows that obscure body | Remove lighting instructions; Style Lock handles all lighting |
| Cropped or "portrait" framing request | Model frames to face/torso; loses full-body read | Remove framing instructions; full body is enforced by Style Lock |
| Extreme profile (full side-view) request | Loses 3/4 depth; character looks flat | Remove angle instructions; slight 3/4 angle is enforced by Style Lock |

---

## Category 2: Prompt Construction Failures

Structural problems in CHARACTER_DESCRIPTION that produce weak or incorrect output.

| Anti-pattern | Symptom | Fix |
|---|---|---|
| Abstract adjectives without visual translation ("cute", "cool", "beautiful") | Model interprets generically; output is forgettable | Translate: "cute" → "round body, large sparkly eyes, rosy cheeks" |
| Over-specified prompt (>300 words) | Model deprioritizes elements; random subset appears | Trim to 80–200 words; move excess to references/ or cut |
| Under-specified prompt (<60 words) | Model fills gaps with defaults; unexpected results | Add TRAITS and EXPRESSION detail |
| Missing WHO age bracket | DALL-E 3 defaults to adult for ambiguous prompts | Always specify age bracket |
| Pure white outfit | Outfit disappears against white background | Substitute off-white, ivory, or cream |
| Text-on-props (signs, labels, product names) | DALL-E 3 renders text unreliably; garbled letters | Remove all text from props; use blank signboards or icon props instead |
| Named copyrighted IP (character name) | Model may refuse or produce unstable output | Remove name; describe the character's attributes instead |

---

## Category 3: Character Set Coherence Failures

Failures specific to multi-character sets from `managing-character-sets`.

| Anti-pattern | Symptom | Fix |
|---|---|---|
| No Design Token confirmation before generation | Characters feel stylistically disconnected | Always confirm Design Token Set before generating any character |
| Same species + same age bracket for 2 characters | Characters look indistinguishable except for color | Change species or age bracket for one character |
| Identical primary outfit colors | Characters blend; hard to distinguish in small sizes | Each character must have a distinct primary outfit color |
| All characters with same expression | Set feels static; characters lack personality differentiation | Vary: at least 3 different expression types across a 4-character set |
| Generating all characters simultaneously | No opportunity to catch Style Lock violations before repeating them | Generate in sequence; verify each before moving to next |
| Props not role-differentiated | Characters look like duplicates with different colors | Assign each character a distinct prop that signals their specific role |

---

## Category 4: Workflow Anti-Patterns

Process failures that waste generation credits or produce unusable outputs.

| Anti-pattern | Consequence | Fix |
|---|---|---|
| Skipping prompt scoring before generation | Weak prompt generates weak image; credit wasted | Always score CHARACTER_DESCRIPTION before calling Zapier; fix anything below 70 |
| Using `chatgpt_openai_create_image_edit` for new characters | DALL-E 2 produces lower-quality new renders | Use `chatgpt_openai_generate_an_image` (DALL-E 3) for new characters only |
| Using `chatgpt_openai_generate_an_image` for edits | DALL-E 3 generates entirely new image, ignoring source | Use `chatgpt_openai_create_image_edit` (DALL-E 2) for modifications to existing images |
| Not saving output to workspace folder | Output exists only in session; lost when session ends | Always save both the CHARACTER_DESCRIPTION and image filename to the workspace folder |
| Generating variations without versioning | Cannot track which version was used for which output | Always increment `-v[N]` in filename for each generation attempt |
| Skipping Design Token confirmation for multi-character sets | Later characters diverge from early ones | Lock tokens first; confirm before generating character 1 |

---

## Category 5: User Communication Failures

Patterns in how character descriptions are presented that create downstream issues.

| Anti-pattern | Problem | Fix |
|---|---|---|
| Delivering generated fields without labeling | User cannot tell what they contributed vs. what was made up | Label all generated fields `[GENERATED]`; label user-provided content `[FROM USER]` |
| Presenting a prompt without the score | User has no signal about quality before requesting generation | Always deliver score with prompt |
| Not including reuse instructions in set package | User cannot extend the set later | Always include "How to add a character to this set" instructions in the Character Set Package |
| Skipping HITL confirmation for Design Tokens | Tokens set silently; user gets an unexpected visual language | Present and confirm Design Tokens before generating any character in a set |

