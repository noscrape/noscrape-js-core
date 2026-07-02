import { NoscrapeApiError } from './errors';
import type { NoscrapeApiRequest, NoscrapeApiResponse } from './types';

export class NoscrapeClient {
    public constructor(
        private readonly endpoint: string,
        private readonly apiKey?: string,
    ) {
    }

    public async obfuscate(request: NoscrapeApiRequest): Promise<NoscrapeApiResponse> {
        const headers: HeadersInit = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        if (this.apiKey !== undefined) {
            headers.Authorization = `Bearer ${this.apiKey}`;
        }

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new NoscrapeApiError(
                `Noscrape API returned ${response.status}.`,
                response.status,
            );
        }

        return await response.json() as Promise<NoscrapeApiResponse>;
    }
}
