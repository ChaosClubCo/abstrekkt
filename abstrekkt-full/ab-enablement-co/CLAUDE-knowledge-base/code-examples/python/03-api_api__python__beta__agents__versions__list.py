// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
page = client.beta.agents.versions.list(
    agent_id="agent_011CZkYpogX7uDKUyvBTophP",
)
page = page.data[0]
print(page.id)
