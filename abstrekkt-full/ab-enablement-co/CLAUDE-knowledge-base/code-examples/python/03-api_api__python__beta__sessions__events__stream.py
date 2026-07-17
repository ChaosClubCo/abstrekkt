// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
for event in client.beta.sessions.events.stream(
    session_id="sesn_011CZkZAtmR3yMPDzynEDxu7",
):
  print(event)
