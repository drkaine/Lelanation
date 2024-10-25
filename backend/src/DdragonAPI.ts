export class DdragonAPI {
  private url: string = "https://ddragon.leagueoflegends.com/cdn/14.21.1/";

  public async access(target: string) {
    const response = await fetch(this.url + target);

    return response;
  }

  public async loadJson(target: string) {
    const response = await this.access(target);

    const data = await response.json();

    return data;
  }
}
