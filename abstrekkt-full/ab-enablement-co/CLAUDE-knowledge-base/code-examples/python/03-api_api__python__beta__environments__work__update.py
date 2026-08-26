// --- block 0 (lang: python) ---
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)
beta_self_hosted_work = client.beta.environments.work.update(
    work_id="work_id",
    environment_id="env_011CZkZ9X2dpNyB7HsEFoRfW",
    metadata={
        "foo": "string"
    },
)
print(beta_self_hosted_work.id)
