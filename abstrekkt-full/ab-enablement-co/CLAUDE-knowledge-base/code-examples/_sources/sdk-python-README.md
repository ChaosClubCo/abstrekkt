---
title: "anthropic-sdk-python"
source: "https://github.com/anthropics/anthropic-sdk-python"
crawled: "2026-06-07"
content_hash: "sha256:6956fcba32230016b045f9b767afeea57a32d516ef61922f9be4996445f745e4"
category: "platform"
audience: "developer"
deprecated: false
---

# Claude SDK for Python

[![PyPI version](https://img.shields.io/pypi/v/anthropic.svg)](https://pypi.org/project/anthropic/)

The Claude SDK for Python provides access to the [Claude API](https://docs.anthropic.com/en/api/) from Python applications.

## Documentation

Full documentation is available at **[platform.claude.com/docs/en/api/sdks/python](https://platform.claude.com/docs/en/api/sdks/python)**.

## Installation

```sh
pip install anthropic
```

## Getting started

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),  # This is the default and can be omitted
)

message = client.messages.create(
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Hello, Claude",
        }
    ],
    model="claude-opus-4-6",
)
print(message.content)
```

## Requirements

Python 3.9+

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
