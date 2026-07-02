import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Noscrape } from '../src';

describe('Noscrape', () => {
    beforeEach(() => {
        vi.stubGlobal('crypto', {
            randomUUID: vi
                .fn()
                .mockReturnValueOnce('id-1')
                .mockReturnValueOnce('id-2')
                .mockReturnValueOnce('id-3')
                .mockReturnValueOnce('id-4'),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('creates an instance', () => {
        expect(new Noscrape()).toBeInstanceOf(Noscrape);
    });

    it('finds noscrape elements', async () => {
        document.body.innerHTML = `
            <span data-noscrape>hello@example.com</span>
            <span data-noscrape>0123456789</span>
            <span>normal text</span>
        `;

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: {
                        ignoreWhitespace: true,
                        items: {
                            'id-1': 'AAA',
                            'id-2': 'BBB',
                        },
                    },
                    font: '',
                    format: 'otf',
                }),
            }),
        );

        const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});

        await new Noscrape({
            debug: true,
        }).render();

        expect(debug).toHaveBeenCalledWith(
            '[Noscrape] elements found',
            2,
        );
    });

    it('uses a custom selector', async () => {
        document.body.innerHTML = `
            <span class="secret">A</span>
            <span class="secret">B</span>
        `;

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: {
                        ignoreWhitespace: true,
                        items: {
                            'id-1': 'A',
                            'id-2': 'B',
                        },
                    },
                    font: '',
                    format: 'otf',
                }),
            }),
        );

        const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});

        await new Noscrape({
            selector: '.secret',
            debug: true,
        }).render();

        expect(debug).toHaveBeenCalledWith(
            '[Noscrape] elements found',
            2,
        );
    });

    it('batches all elements into a single request', async () => {
        document.body.innerHTML = `
            <span data-noscrape>a</span>
            <span data-noscrape>b</span>
            <span data-noscrape>c</span>
        `;

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    ignoreWhitespace: true,
                    items: {
                        'id-1': 'A',
                        'id-2': 'B',
                        'id-3': 'C',
                    },
                },
                font: '',
                format: 'otf',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        await new Noscrape().render();

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('deduplicates strings before sending them to the API', async () => {
        document.body.innerHTML = `
            <span data-noscrape>hello@example.com</span>
            <span data-noscrape>hello@example.com</span>
            <span data-noscrape>0123456789</span>
            <span data-noscrape>0123456789</span>
        `;

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    ignoreWhitespace: true,
                    items: {
                        'id-1': 'AAA',
                        'id-2': 'BBB',
                    },
                },
                font: '',
                format: 'otf',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        await new Noscrape().render();

        // @ts-ignore
        const [, options] = fetchMock.mock.calls[0];
        const request = JSON.parse((options as RequestInit).body as string);

        expect(request.items).toEqual({
            'id-1': 'hello@example.com',
            'id-2': '0123456789',
        });
    });

    it('renders all matching elements', async () => {
        document.body.innerHTML = `
            <span data-noscrape>hello@example.com</span>
            <span data-noscrape>hello@example.com</span>
        `;

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    ignoreWhitespace: true,
                    items: {
                        'id-1': '<span class="noscrape">encrypted</span>',
                    },
                },
                font: '',
                format: 'otf',
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        await new Noscrape().render();

        expect(document.querySelectorAll('.noscrape')).toHaveLength(2);
    });
});
