const key = Bun.env.STEAM_API_KEY;

const limit = 5000;
const minPlayers = 20;

const url = `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${key}&filter=\\empty\\1&limit=${limit}`;

const response = await fetch(url);

// Need to find a way to parse JSON without writing to a file
// Currently this is the workaround to avoid the error while parsing JSON

await Bun.write('servers', response);

const file = Bun.file('servers');

const servers = await file.json();

const validServers = servers.response.servers.filter((server: { players: number }) => server.players > minPlayers);

console.log(`Found ${validServers.length} servers with more than ${minPlayers} players`);

const ids = [] as string[];
const ids_unfiltered = [];
const serverIds = [] as string[];

for (const server of validServers) {
  serverIds.push(server.steamid);
}

console.log(serverIds);

process.exit();
