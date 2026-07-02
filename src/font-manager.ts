import type { FontRegistration, NoscrapeApiResponse } from './types';

export class FontManager {
    private readonly loaded = new Map<string, string>();

    public async load(response: NoscrapeApiResponse): Promise<FontRegistration> {
        const key = `${response.format}:${response.font}`;

        const existing = this.loaded.get(key);

        if (existing) {
            return {
                family: existing,
            };
        }

        const family = `Noscrape-${this.loaded.size + 1}`;

        if (typeof FontFace !== 'undefined') {
            const font = new FontFace(
                family,
                `url(data:font/${response.format};base64,${response.font})`,
            );

            await font.load();

            document.fonts.add(font);
        }

        this.loaded.set(key, family);

        return {
            family,
        };
    }
}
