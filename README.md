# This is Scraper for SteamIDs

I created it spontaneously because I needed a huge amount of valid SteamIDs for my another project.

I will use GitHub actions. Script will run every day and get list of X amount of SteamIDs. Script will upodate the list of SteamIDs in the repository. List will grow every day. The only downside is that I follow friends of friends. This is slower than starting from first possible ID, but in this way I will get real people.

## How does it work?

1. First we start with at least one valid SteamID.
2. We get friends of this SteamID.
3. We get friends of friends of this SteamID.
4. And so on, until we have enough SteamIDs.

## TODO's

- [ ] Split database into smaller files (e.g. 10k IDs per file)
- [ ] Make code better
