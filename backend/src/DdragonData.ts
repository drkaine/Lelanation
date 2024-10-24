export async function getChampions() {
  const response = await connectUrl();

  const data = await response.json();

  return data;
}

export async function connectUrl() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/data/en_US/champion.json",
  );

  return response;
}
