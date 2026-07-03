# Noscrape JavaScript SDK

Official JavaScript SDK for Noscrape.

Protect email addresses, phone numbers and other sensitive text from bots by obfuscating them **before** your HTML is sent to the browser.

This SDK is designed for server-side environments such as Node.js, server-side rendering (SSR) frameworks and custom backend integrations.

## Features

- Framework agnostic
- Server-side obfuscation
- TypeScript support
- ESM and CommonJS
- Lightweight
- Zero runtime dependencies

---

## Installation

```bash
npm install @noscrape/js
```

---

## Basic Usage

```ts
import { Noscrape } from '@noscrape/js';

const noscrape = new Noscrape({
    apiKey: process.env.NOSCRAPE_API_KEY,
});

const response = await noscrape.obfuscate({
    email: 'hello@example.com',
    phone: '+49 170 1234567',
});
```

The response contains the obfuscated text, embedded font and font format.

```ts
{
    data: {
        items: {
            email: '...',
            phone: '...'
        }
    },
    font: 'AAEAAA...',
    format: 'otf'
}
```

Your application is responsible for rendering the returned values into HTML.

---

## Options

| Option | Default | Description |
|---------|---------|-------------|
| endpoint | https://api.noscrape.eu/obfuscate | Noscrape API endpoint |
| apiKey | - | Noscrape API key |
| ignoreWhitespace | true | Ignore whitespace while obfuscating |
| font | - | Use a custom font |
| cache | true | Reserved for future versions |
| debug | false | Enable debug logging |

Example:

```ts
const noscrape = new Noscrape({
    apiKey: process.env.NOSCRAPE_API_KEY,
    debug: true,
});
```

---

## API

### obfuscate()

Obfuscates one or more strings.

```ts
const response = await noscrape.obfuscate({
    email: 'hello@example.com',
    phone: '+49 170 1234567',
});
```

The object keys remain unchanged and are returned in the response.

---

## Response

```ts
interface NoscrapeApiResponse {
    data: {
        ignoreWhitespace: boolean;
        items: Record<string, string>;
    };

    font: string;
    format: string;
}
```

---

## Supported Environments

- Node.js
- Bun
- Deno
- Server-side rendering (SSR)
- Edge runtimes supporting Fetch API

Examples include:

- Next.js
- Nuxt
- Astro
- Express
- Fastify
- Hono
- Custom Node.js applications

---

## Documentation

https://noscrape.eu/docs

## License

MIT
