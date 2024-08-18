let scrapedIds = [] as string[];
const start = Date.now();
import urls from './urls_to_scrape';

const scrape = async (url: string) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const ids = text.match(/\d{17}/gm);
    if (ids) {
      for (const id of ids) {
        if (!scrapedIds.includes(id)) {
          scrapedIds.push(id);
        }
      }
    }
  } catch (error) {}
};

if (urls.length) {
  for (const url of urls) {
    console.log(`Scraping ${url}`);
    await scrape(url);
  }
  // This page has 200 pages of backpacks (20000 entries)
  const backpacksUrl = 'https://backpack.tf/top/backpacks/';
  for (let i = 1; i < 201; i++) {
    console.log(`Scraping ${backpacksUrl}${i}`);
    await scrape(`${backpacksUrl}${i}`);
  }
}

console.log(`Scraped ${scrapedIds.length} ids in ${((Date.now() - start) / 1000).toFixed(2)} seconds`);

scrapedIds = [...new Set(scrapedIds)].sort();

await Bun.write('../scraped_ids.json', JSON.stringify(scrapedIds, null, 2));
