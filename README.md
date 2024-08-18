# This is Scraper for SteamIDs

I created it spontaneously because I needed a huge amount of valid SteamIDs for my another project.

I will use GitHub actions. Script will run every day and get list of X amount of SteamIDs. Script will upodate the list of SteamIDs in the repository. List will grow every day. The only downside is that I follow friends of friends. This is slower than starting from first possible ID, but in this way I will get real people.

## How does it work?

1. First we start with at least one valid SteamID.
2. We get friends of this SteamID.
3. We get friends of friends of this SteamID.
4. And so on, until we have enough SteamIDs.

## Usage

As I said, script was created spontaneously. It's not finished yet.

1. You need to clone this repository, for sure.
2. Set `STEAM_API_KEY` in `.env` file (or somewhere else). You can get it [here](https://steamcommunity.com/dev/apikey).
3. Run `bun run scrape_from_urls.ts` in `/scraper` directory. It will create list of about 10k SteamIDs. That will be enough for the beginning. File will be saved in root directory with name `scraped_ids.json`. Then rename it to `ids.json`.
4. Run `bun run index.ts` and wait. By default it will do maximum 25k requests per day. You can change it in `config.ts` file.

## TODO's

- [ ] Split database into smaller files (e.g. 10k IDs per file)
- [ ] Make code better
