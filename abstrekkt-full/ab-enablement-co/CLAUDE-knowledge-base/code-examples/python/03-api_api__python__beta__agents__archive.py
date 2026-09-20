// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_agent = client.beta.agents.archive(
    agent_id="agent_011CZkYpogX7uDKUyvBTophP",
)
print(beta_managed_agents_agent.id)
