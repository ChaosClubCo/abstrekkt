// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_session = client.beta.sessions.archive(
    session_id="sesn_011CZkZAtmR3yMPDzynEDxu7",
)
print(beta_managed_agents_session.id)
