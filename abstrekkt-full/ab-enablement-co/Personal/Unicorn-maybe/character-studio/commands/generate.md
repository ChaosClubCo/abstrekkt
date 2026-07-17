---
description: Generate a single 3D cartoon character render
argument-hint: [character description or name]
allowed-tools: Read, Write, Bash(zapier:*)
disable-model-invocation: false
---

Gather the following from the user before generating. If any detail was provided as an argument, use it directly and skip that question:

1. **Who is this character?** (name, role, species — e.g. "Maya, a confident astronaut")
2. **Key personality traits** (2–3 adjectives — e.g. "curious, determined, playful")
3. **Outfit and visual signature** (colors, garments, accessories)
4. **Expression and pose** (default: warm smile, slight 3/4 angle)
5. **Props or context objects** (optional — e.g. "holding a telescope")

Once you have all five details, hand off to the **generating-3d-characters** skill.
The skill enforces the Style Lock (white background, soft studio lighting, Pixar/Disney aesthetic, 1024×1024) and calls `Zapier:chatgpt_openai_generate_an_image`. Do not generate the image yourself — let the skill handle prompt construction, tool calls, and output delivery.
