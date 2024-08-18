// I stopped in middle of work on this script
// It was supposed to extract friends of friends from Steam API

const key = Bun.env.STEAM_API_KEY;

import config from './config';

console.log(`Loaded config with ${config.idsLimit} IDs limit and ${config.dailyRequestsLimit} requests limit`);

type Id = { [id: string]: boolean };
const idsFilePath = 'ids.json';
const idsFile = Bun.file(idsFilePath);
const ids = (await idsFile.json()) as Id;
let foundIds = [] as string[];

console.log(`Loaded ${Object.keys(ids).length} IDs from database`);

const blacklistFilePath = 'blacklist.json';
const blacklistFile = Bun.file(blacklistFilePath);
const blacklist = (await blacklistFile.json()) as string[];

type Run = { timestamp: number; requests: number; ids: number };
const runsFilePath = 'runs.json';
const runsFile = Bun.file(runsFilePath);
const runs = (await runsFile.json()) as Run[];
const startTime = Date.now();

let requests = 0;

function avoidId(id: string) {
  delete ids[id];
  blacklist.push(id);
  console.log(`Blacklisted ${id}`);
}

async function extractIds(id: string) {
  const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${key}&steamid=${id}`;

  if (!ableToMakeRequests()) {
    console.log(`Reached daily requests limit of ${config.dailyRequestsLimit}`);
    await finish();
  }

  if (blacklist.includes(id)) {
    console.log(`Skipping blacklisted ${id}`);
    return;
  }

  if (requests >= possibleRequests) {
    console.log(`Reached requests limit of ${config.dailyRequestsLimit}`);
    await finish();
  }

  try {
    requests++;
    const response = await fetch(url);
    let data = null;

    if (response.status === 500 || response.status === 404) avoidId(id);

    if (response.status === 200) {
      ids[id] = true;
      data = await response.json();
    } else {
      return;
    }

    if (!data.friendslist.friends) return;

    interface Friend {
      steamid: string;
    }

    // create new array of IDs that are not in ids and in blacklist
    const newFriends = data.friendslist.friends.filter(
      (friend: Friend) => !ids[friend.steamid] && !blacklist.includes(friend.steamid),
    );

    console.log(`Found ${newFriends.length} friends of ${id}`);

    foundIds = [...foundIds, ...newFriends];

    for (const friend of newFriends) {
      ids[friend.steamid] = false;
    }
  } catch (error) {
    console.error(error);
  }
}

// Sum of requests in past 24 hours
// I think this function is not working properly
const requestsInPast24Hours = () => {
  return runs
    .filter((run) => run.timestamp > Date.now() - 24 * 60 * 60 * 1000)
    .reduce((acc, run) => acc + run.requests, 0);
};

const requestsLeft = () => {
  return config.dailyRequestsLimit - requestsInPast24Hours();
};

function ableToMakeRequests() {
  return requestsInPast24Hours() < config.dailyRequestsLimit;
}

function secondsToHumanReadable(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${sec}s`;
}

async function finish() {
  console.log(`Found ${foundIds.length} IDs in ${secondsToHumanReadable((Date.now() - startTime) / 1000)}`);

  for (const id of foundIds) {
    ids[id] = false;
  }

  try {
    console.log(`Writing IDs to ${idsFilePath} file`);
    await Bun.write('ids.json', JSON.stringify(ids, null, 2));
  } catch (error) {
    console.error(error);
  }
  try {
    console.log(`Writing result of runs to ${runsFilePath} file`);
    await Bun.write(
      'runs.json',
      JSON.stringify([{ timestamp: Date.now(), requests: requests, ids: foundIds.length }, ...runs], null, 2),
    );
  } catch (error) {
    console.error(error);
  }
  try {
    console.log(`Writing blacklist to ${blacklistFilePath} file`);
    await Bun.write('blacklist.json', JSON.stringify(blacklist, null, 2));
  } catch (error) {
    console.error(error);
  }
  console.log(`Total amount of IDs in database: ${Object.keys(ids).length}`);
  process.exit(0);
}

const possibleRequests = requestsLeft();

if (!ableToMakeRequests()) {
  console.log(`Reached daily requests limit of ${config.dailyRequestsLimit}`);
  process.exit(0);
} else {
  console.log(`Requests in past 24 hours: ${requestsInPast24Hours()}`);
  console.log(`Possible to make ${possibleRequests} requests`);
}

process.on('SIGINT', async () => {
  await finish();
});

process.on('SIGTERM', async () => {
  await finish();
});

for (const id of Object.keys(ids)) {
  if (blacklist.includes(id)) {
    avoidId(id);
    continue;
  }
  if (!ids[id]) {
    await extractIds(id);
  }
}

// Finish
await finish();
