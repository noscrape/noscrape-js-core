export interface NoscrapeOptions {
    endpoint?: string;
    host?: string;
    apiKey?: string;
    font?: string;
    ignoreWhitespace?: boolean;
    cache?: boolean;
    debug?: boolean;
}

export interface NoscrapeConfig {
    endpoint: string;
    host?: string;
    apiKey?: string;
    font?: string;
    ignoreWhitespace: boolean;
    cache: boolean;
    debug: boolean;
}

export interface NoscrapeRenderOptions {
    root?: ParentNode;
}

export interface NoscrapeApiRequest {
    items: Record<string, string>;
    ignoreWhitespace: boolean;
    font?: string;
}

export interface NoscrapeApiResponse {
    data: {
        ignoreWhitespace: boolean;
        items: Record<string, string>;
    };
    font: string;
    format: string;
}

export interface PendingItem {
    id: string;
    value: string;
    elements: HTMLElement[];
}

export interface FontRegistration {
    family: string;
}

export interface IdGenerator {
    generate(): string;
}
