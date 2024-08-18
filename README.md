# This is Scraper for Steam Community IDs

I created it spontaneously because I needed a huge amount of valid SteamIDs for testing my another project. **I recommend not collecting or sharing** the generated SteamID databases. Use this tool for educational purposes only. As the creator of this tool, I am not responsible for its use.

This scraper is not finished yet, but it works.  
The only big issue is that it saves IDs into one single file. I need to change it in first place.

## How does it work?

1. First we start with at least one valid SteamID.
2. We get friends of this SteamID.
3. We get friends of friends of this SteamID.
4. And so on, until we have enough SteamIDs.

## Usage

As I said, script was created spontaneously. It's not finished yet.

1. You need to clone this repository.
2. Set `STEAM_API_KEY` in `.env` file (or somewhere). You can get it [here](https://steamcommunity.com/dev/apikey).
3. Run `bun run scrape_from_urls.ts` in `/scraper` directory. It will create list of about 10k SteamIDs. That will be enough for the beginning. File will be saved in root directory with name `scraped_ids.json`. Then rename it manually to `ids.json`.
4. Run `bun run index.ts` and wait. By default it will do maximum 25k requests per day. You can change it in `config.ts` file.

## TODO's

- [ ] Split database into smaller files (e.g. 10k IDs per file)
- [ ] Make code better. Especially flow.
