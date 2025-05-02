export interface UrlEntry {
  id: number;
  url: string;
  shortUrl: string;
  createdAt: Date;
  visitCount: number;
}

export default class UrlProvider {
  private static store: Map<string, UrlEntry> = new Map();
  private static nextId = 1;

  public async save(shortPath: string, entry: UrlEntry): Promise<void> {
    UrlProvider.store.set(shortPath, entry);
  }

  public async getNextId(): Promise<number> {
    return UrlProvider.nextId++;
  }

  public async getByUrl(url: string): Promise<UrlEntry | undefined> {
    return Array.from(UrlProvider.store.values()).find((e) => e.url === url);
  }

  public async getByShortUrl(shortUrl: string): Promise<UrlEntry | undefined> {
    return Array.from(UrlProvider.store.values()).find((e) => e.shortUrl === shortUrl);
  }

  public async getByShortPath(shortPath: string): Promise<UrlEntry | undefined> {
    return UrlProvider.store.get(shortPath);
  }
}
