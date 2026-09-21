// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
version = client.beta.skills.versions.create(
    skill_id="skill_id",
)
print(version.id)
