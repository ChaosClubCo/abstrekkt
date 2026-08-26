// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_managed_agents_send_session_events = client.beta.sessions.events.send(
    session_id="sesn_011CZkZAtmR3yMPDzynEDxu7",
    events=[{
        "content": [{
            "text": "Where is my order #1234?",
            "type": "text",
        }],
        "type": "user.message",
    }],
)
print(beta_managed_agents_send_session_events.data)
