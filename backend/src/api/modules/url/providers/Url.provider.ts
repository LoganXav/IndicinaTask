export interface UrlEntry {
  id: number;
  url: string;
  createdAt: Date;
  expiresAt?: Date;
  shortUrl: string;
  isActive: boolean;
  visitCount: number;
  lastVisitedAt: Date | null;
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

  public async getAll(): Promise<UrlEntry[]> {
    return Array.from(UrlProvider.store.values());
  }

  public async delete(shortPath: string): Promise<void> {
    UrlProvider.store.delete(shortPath);
  }
}
