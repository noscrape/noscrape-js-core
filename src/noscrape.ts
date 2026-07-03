import type {
    NoscrapeApiRequest,
    NoscrapeApiResponse,
    NoscrapeConfig,
    NoscrapeOptions,
} from './types';
import { NoscrapeClient } from './client';

export class Noscrape {
    private readonly options: NoscrapeConfig;
    private readonly client: NoscrapeClient;

    public constructor(options: NoscrapeOptions = {}) {
        this.options = {
            endpoint: options.endpoint ?? this.endpointFromHost(options.host),
            ignoreWhitespace: options.ignoreWhitespace ?? true,
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

        this.client = new NoscrapeClient(
            this.options.endpoint,
            this.options.apiKey,
        );
    }

    public async obfuscate(
        items: Record<string, string>,
    ): Promise<NoscrapeApiResponse> {
        const request: NoscrapeApiRequest = {
            items,
            ignoreWhitespace: this.options.ignoreWhitespace,
        };

        if (this.options.font !== undefined) {
            request.font = this.options.font;
        }

        if (this.options.debug) {
            console.debug('[Noscrape] request', request);
        }

        return await this.client.obfuscate(request);
    }

    private endpointFromHost(host?: string): string {
        const normalizedHost = host?.replace(/\/+$/, '') ?? 'https://api.noscrape.eu';

        return `${normalizedHost}/obfuscate`;
    }
}
