export class NoscrapeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'NoscrapeError';
  }
}

export class NoscrapeApiError extends NoscrapeError {
  public constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'NoscrapeApiError';
  }
}
