export default class PingHealthProvider {
  public async get(name: string, date: string): Promise<string> {
    return Promise.resolve(`${name.toUpperCase()} api service is online at ${date}`);
  }
}
