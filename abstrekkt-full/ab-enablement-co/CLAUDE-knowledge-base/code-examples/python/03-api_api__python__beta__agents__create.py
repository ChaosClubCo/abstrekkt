// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_agent = client.beta.agents.create(
    model="claude-sonnet-4-6",
    name="My First Agent",
)
print(beta_managed_agents_agent.id)
