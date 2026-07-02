# Noscrape JavaScript SDK

Official JavaScript SDK for Noscrape.

Protect email addresses, phone numbers and other sensitive text from bots while keeping them fully readable for real users.

## Features

- Framework agnostic
- Automatic DOM scanning
- Single API request per page
- Duplicate detection
- Automatic font loading
- TypeScript support
- ESM and CommonJS
- Lightweight
- Zero dependencies

---

## Installation

```bash
npm install @noscrape/js
```

---

## Basic Usage

HTML

```html
<span data-noscrape>
    hello@example.com
</span>

<span data-noscrape>
    +49 170 1234567
</span>
```

JavaScript

```ts
import { Noscrape } from '@noscrape/js';

const noscrape = new Noscrape({
    apiKey: 'YOUR_API_KEY',
});

await noscrape.render();
```

---

## Options

| Option | Default | Description |
|---------|---------|-------------|
| endpoint | https://api.noscrape.eu/obfuscate | API endpoint |
| apiKey | - | Noscrape API key |
| selector | `[data-noscrape]` | CSS selector |
| ignoreWhitespace | true | Ignore whitespace while obfuscating |
| cache | true | Enable client-side cache |
| debug | false | Enable debug logging |
| font | - | Custom font |

Example

```ts
new Noscrape({
    apiKey: 'YOUR_API_KEY',
    debug: true,
});
```

---

## API

### render()

Scans the current document for matching elements and replaces their contents with obfuscated text returned by the Noscrape API.

```ts
await noscrape.render();
```

Render a specific subtree:

```ts
await noscrape.render({
    root: document.querySelector('#content'),
});
```

---

## Browser Support

- Chrome
- Edge
- Firefox
- Safari

Requires support for:

- Fetch API
- FontFace API
- ES Modules

---

## Documentation

https://noscrape.eu/docs

---

## License

MIT
