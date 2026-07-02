import type {
    NoscrapeApiRequest,
    NoscrapeConfig,
    NoscrapeOptions,
    NoscrapeRenderOptions,
} from './types';
import { NoscrapeClient } from './client';
import { PendingScanner } from './pending-scanner';
import { FontManager } from './font-manager';
import { Renderer } from './renderer';

export class Noscrape {
    private readonly options: NoscrapeConfig;
    private readonly scanner = new PendingScanner();
    private readonly renderer = new Renderer();
    private readonly fontManager = new FontManager();

    public constructor(options: NoscrapeOptions = {}) {
        this.options = {
            endpoint: options.endpoint ?? this.endpointFromHost(options.host),
            ignoreWhitespace: options.ignoreWhitespace ?? true,
            selector: options.selector ?? '[data-noscrape]',
            cache: options.cache ?? true,
            debug: options.debug ?? false,
        };

        if (options.host !== undefined) {
            this.options.host = options.host;
        }

        if (options.apiKey !== undefined) {
            this.options.apiKey = options.apiKey;
        }

        if (options.font !== undefined) {
            this.options.font = options.font;
        }
    }

    public async render(options: NoscrapeRenderOptions = {}): Promise<void> {
        const root = options.root ?? document;

        const elements = Array.from(
            root.querySelectorAll<HTMLElement>(this.options.selector),
        );

        if (this.options.debug) {
            console.debug('[Noscrape] options', options);
            console.debug('[Noscrape] elements found', elements.length);
        }

        if (elements.length === 0) {
            return;
        }

        const pending = this.scanner.scan(elements);

        if (pending.length === 0) {
            return;
        }

        const request: NoscrapeApiRequest = {
            items: {},
            ignoreWhitespace: this.options.ignoreWhitespace,
        };

        for (const item of pending) {
            request.items[item.id] = item.value;
        }

        if (this.options.font !== undefined) {
            request.font = this.options.font;
        }

        const client = new NoscrapeClient(
            this.options.endpoint,
            this.options.apiKey,
        );

        const response = await client.obfuscate(request);

        const font = await this.fontManager.load(response);

        this.renderer.render(
            pending,
            response.data.items,
            font.family,
        );
    }

    private endpointFromHost(host?: string): string {
        const normalizedHost = host?.replace(/\/+$/, '') ?? 'https://api.noscrape.eu';

        return `${normalizedHost}/obfuscate`;
    }
}
