import type { PendingItem } from './types';

export class PendingScanner {
    public scan(elements: HTMLElement[]): PendingItem[] {
        const pending = new Map<string, PendingItem>();

        for (const element of elements) {
            const value = element.textContent?.trim();

            if (!value) {
                continue;
            }

            const existing = pending.get(value);

            if (existing) {
                existing.elements.push(element);
                continue;
            }

            pending.set(value, {
                id: crypto.randomUUID(),
                value,
                elements: [element],
            });
        }

        return [...pending.values()];
    }
}
