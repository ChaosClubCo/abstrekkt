// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
response = client.beta.skills.versions.download(
    version="version",
    skill_id="skill_id",
)
print(response)
content = response.read()
print(content)
