import urls from './urls_to_scrape';

const scrapedIds = {} as { [key: string]: boolean };
const start = Date.now();

const scrape = async (url: string) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const ids = text.match(/\d{17}/gm);
    if (ids) {
      for (const id of ids) {
        if (!scrapedIds[id]) {
          scrapedIds[id] = false;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

if (urls.length) {
  for (const url of urls) {
    console.log(`Scraping ${url}`);
    await scrape(url);
  }
  const backpacksUrl = 'https://backpack.tf/top/backpacks/';
  for (let i = 1; i < 201; i++) {
    console.log(`Scraping ${backpacksUrl}${i}`);
    await scrape(`${backpacksUrl}${i}`);
  }
} else {
  console.log('No URLs to scrape');
}

console.log(`Scraped ${scrapedIds.length} IDs in ${((Date.now() - start) / 1000).toFixed(2)} seconds`);

await Bun.write('../ids_.json', JSON.stringify(scrapedIds, null, 2));
