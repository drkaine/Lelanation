export class DdragonAPI {
  private url: string = "https://ddragon.leagueoflegends.com/cdn/14.21.1/";

  public async access(target: string): Promise<Response> {
    const response = await fetch(this.url + target);

    return response;
  }

  public async loadJson(target: string): Promise<JSON> {
    const response = await this.access(target);

    const data = await response.json();

    return data;
  }
}
