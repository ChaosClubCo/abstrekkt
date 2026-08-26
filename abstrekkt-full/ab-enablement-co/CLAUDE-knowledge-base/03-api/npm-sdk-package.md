---
title: "@anthropic-ai/sdk (npm)"
source: "https://www.npmjs.com/package/@anthropic-ai/sdk"
crawled: "2026-06-07"
content_hash: "sha256:4010780be6961b789c7a7c7da4a5f8c0b8cbea5227202ca4503c0f1441c0a6dc"
category: "api"
audience: "developer"
deprecated: false
---

# <img src=".github/logo.svg" alt="" width="32"> Claude SDK for TypeScript

[![NPM version](https://img.shields.io/npm/v/@anthropic-ai/sdk.svg)](https://npmjs.org/package/@anthropic-ai/sdk)

The Claude SDK for TypeScript provides access to the [Claude API](https://docs.anthropic.com/en/api/) from server-side TypeScript or JavaScript applications.

## Documentation

Full documentation is available at **[platform.claude.com/docs/en/api/sdks/typescript](https://platform.claude.com/docs/en/api/sdks/typescript)**.

## Installation

```sh
npm install @anthropic-ai/sdk
```

## Getting started

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const message = await client.messages.create({
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello, Claude' }],
  model: 'claude-opus-4-6',
});

console.log(message.content);
```

## Requirements

Node.js 18+

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
