import type {PendingItem} from './types';

export class Renderer {
    public render(
        pending: PendingItem[],
        encoded: Record<string, string>,
        fontFamily: string,
    ): void {
        for (const item of pending) {
            const text = encoded[item.id];

            if (text === undefined) {
                continue;
            }

            for (const element of item.elements) {

                if (element.dataset.noscrapeRendered === 'true') {
                    continue;
                }

                element.classList.add('noscrape');
                element.textContent = text;
                element.style.fontFamily = fontFamily;
                element.dataset.noscrapeRendered = 'true';
            }
        }
    }
}
