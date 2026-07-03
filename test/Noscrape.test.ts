import { afterEach, describe, expect, it, vi } from 'vitest';
import { Noscrape } from '../src';

describe('Noscrape', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('creates an instance', () => {
        expect(new Noscrape()).toBeInstanceOf(Noscrape);
    });

    it('sends an obfuscation request', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    ignoreWhitespace: true,
                    items: {
                        email: 'AAA',
                        phone: 'BBB',
                    },
                },
                font: 'FONT',
                format: 'otf',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        const noscrape = new Noscrape();

        const response = await noscrape.obfuscate({
            email: 'hello@example.com',
            phone: '0123456789',
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);

        expect(response.data.items.email).toBe('AAA');
        expect(response.data.items.phone).toBe('BBB');
    });

    it('passes the api key', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    ignoreWhitespace: true,
                    items: {},
                },
                font: '',
                format: 'otf',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        const noscrape = new Noscrape({
            apiKey: 'secret',
        });

        await noscrape.obfuscate({
            email: 'hello@example.com',
        });

        // @ts-ignore
        const [, options] = fetchMock.mock.calls[0];

        expect((options as RequestInit).headers).toMatchObject({
            Authorization: 'Bearer secret',
        });
    });

    it('sends object payloads unchanged', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    ignoreWhitespace: true,
                    items: {},
                },
                font: '',
                format: 'otf',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        const noscrape = new Noscrape();

        await noscrape.obfuscate({
            email: 'hello@example.com',
            phone: '0123456789',
        });

        const [, options] = fetchMock.mock.calls[0];

        const request = JSON.parse(
            (options as RequestInit).body as string,
        );

        expect(request.items).toEqual({
            email: 'hello@example.com',
            phone: '0123456789',
        });
    });

    it('returns the api response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: {
                        ignoreWhitespace: true,
                        items: {
                            email: 'encrypted',
                        },
                    },
                    font: 'FONTDATA',
                    format: 'otf',
                }),
            }),
        );

        const response = await new Noscrape().obfuscate({
            email: 'hello@example.com',
        });

        expect(response).toEqual({
            data: {
                ignoreWhitespace: true,
                items: {
                    email: 'encrypted',
                },
            },
            font: 'FONTDATA',
            format: 'otf',
        });
    });
});
