import { GameDig } from 'gamedig';

const key = Bun.env.STEAM_API_KEY;

const limit = 5000;
const minPlayers = 20;

const url = `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${key}&filter=\\appid\\730\\empty\\1&limit=${limit}`;

const response = await fetch(url);

// Need to find a way to parse JSON without writing to a file
// Currently this is the workaround to avoid the error while parsing JSON

await Bun.write('servers', response);

const file = Bun.file('servers');

const servers = await file.json();

const validServers = servers.response.servers.filter((server: { players: number }) => server.players > minPlayers);

console.log(`Found ${validServers.length} servers with more than ${minPlayers} players`);
console.log(servers.response.servers[1]);

const serverIds = [] as string[];
const serverIps = [];

// second item must be number
for (const server of validServers) {
  const address = server.addr.split(':');
  const host = address[0];
  const port = Number(address[1]);
  serverIps.push([host, port]);
  serverIds.push(server.steamid);
}

// This have no sense, because server is not returning list of player serverIds

// for (const ip of serverIps) {
//   const server = await GameDig.query({
//     type: 'counterstrike2',
//     host: ip[0],
//     port: ip[1],
//   });

//   if (server.players.length > 0) {
//     console.log(server.players);
//   }
// }
