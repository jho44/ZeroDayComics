const puppeteer = require("puppeteer");
const fs = require("node:fs");

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto("https://comic.pixiv.net/viewer/stories/167987");
//   for (let i = 0; i <= pageNum; i++) {
//     `page-${i}`
//     await page.waitForSelector(searchResultSelector);
//     await page.click(searchResultSelector);
//   }
// })();

const cheerio = require("cheerio");

const fileName = "pixivHtml.txt";

const getHtmlWithPuppeteer = async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: "ws://localhost:3000?token=6R0W53R135510",
  });

  const page = await browser.newPage();

  await page.goto("https://comic.pixiv.net/viewer/stories/167987", {
    waitUntil: "networkidle2",
  });

  const html = await page.content();

  fs.writeFile(fileName, html, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
      console.log("file written successfully");
    }
  });
  await browser.close();
  return html;
};

const getHtmlFromFile = () => {
  return fs.readFileSync(fileName, "utf8");
};

(async () => {
  // const html = getHtmlWithPuppeteer();
  const html = getHtmlFromFile();
  const $ = cheerio.load(html);

  const pages = $('div[id^="page-"]');
  console.log(pages.length);
  const data = pages
    .map((_i, e) =>
      $(e)
        .attr("style")
        .match(/url\("(.*?)"/)
    )
    .get();
  console.log(data);
})();
