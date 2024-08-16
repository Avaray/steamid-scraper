// I stopped in middle of work on this script
// It was supposed to extract friends of friends from Steam API

const key = Bun.env.STEAM_API_KEY;

import sourceIds from './user_ids';

console.log(`Loaded ${sourceIds.length} source ids`);

const knownIdsFile = Bun.file('known_ids.txt');
const knownIdsContent = await knownIdsFile.text();
const knownIds = knownIdsContent.split('\n');

console.log(`Loaded ${knownIds.length} known ids`);

const foundIds = [] as string[];

// Numer of ids to extract per script run
const idsLimit = 1000;
const requestsLimit = 10000;

async function extractIds(id: string) {
  const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${key}&steamid=${id}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.friendslist || !data.friendslist.friends) return;
  const friends = data.friendslist.friends;
  for (const friend of friends) {
    if (!foundIds.includes(friend.steamid)) {
      foundIds.push(friend.steamid);
      await extractIds(friend.steamid);
    }
  }
}

const startTime = Date.now();

for (const id of sourceIds) {
  console.log(`Extracting friends for ${id}`);
  await extractIds(id);
}

console.log(`Found ${foundIds.length} friends in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);

// Update known ids file with new ids
const mergedIds = knownIds.concat(foundIds);

// await Bun.write(mergedIds);
