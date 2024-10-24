export async function connect(url: string) {
  const response = await fetch(url);

  return response;
}

export async function getChampions() {
  const url =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/data/fr_FR/champion.json";
  const response = await connect(url);

  const data = await response.json();

  return data;
}
