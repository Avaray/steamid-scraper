# What is this project?

I created it spontaneously. I just wanted to generate a huge list of Steam IDs for my other project. I waned't to generate it by myself because there is no list available on the internet.

### My first idea was to:

1. Get list of servers with players on them
2. For each server get list of players (get their SteamIDs)
3. Save all SteamIDs to a file

But that was not able to be done. Because Steam API does not provide a way to get list of players on a server. The only way to get list of players is to use `a2s`. Unfortunately a2s does not provide SteamIDs. So I had to change my plan.

### Second idea was to:

1. Input some of the SteamIDs I already have
2. Get list of friends for each of them
3. Follow friends of friends until I get enough SteamIDs

But this approach is not good because:

- It is slow
- Uses too many unnecessary requests
- The more SteamIDs I have the less new SteamIDs I get

### Third idea (unrealized yet):

I'm thinking about GitHub actions. I could create a GitHub action that would run every day and get list of X amount of SteamIDs. Script will upodate the list of SteamIDs in the repository. List will grow every day. List will start from #1 and go up to infinity.
