from abc import ABC, abstractmethod
import contextlib
# import requests
from urllib.parse import urlparse
# from PIL import Image
from loguru import logger

import asyncio 
from playwright.async_api import Playwright, async_playwright, Response, Page

# class FirstScrapeRes:
#   def __init__(self, totalPages: int, imgs: List[Any]):
#     self.totalPages = totalPages
#     self.imgs = imgs
  # def __str__(self):
  #   return f"{self.totalPages}\n{self.imgs}"
  
FirstScrapeRes = list[bytes]

class Scraper(ABC):

  @abstractmethod
  def first_scrape(self) -> FirstScrapeRes:
    pass
    
class PixivScraper(Scraper):

  def __init__(self, url: str):
    self.url = url # https://comic.pixiv.net/viewer/stories/167987
    self.episode = urlparse(url).path.split('/')[-1]

  async def __get_blob_urls(self, page: Page):
    return await page.locator('div[id^="page-"]').evaluate_all(
      '(divs) => divs.map((div) => div.style.backgroundImage.match(/url\("(.*?)"/)?.[1])'
    )

  async def __wait_for_blobs(self, evt, timeout):
    # suppress TimeoutError because we'll return False in case of timeout
    with contextlib.suppress(asyncio.TimeoutError):
        await asyncio.wait_for(evt.wait(), timeout)
    return evt.is_set()

  async def __get_raws(self, playwright: Playwright):
    browser = await playwright.chromium.launch()
    context = await browser.new_context()
    page = await context.new_page()

    blob_responses: dict[str, Response] = {}

    def handle_response(response: Response):
      url = response.url
      if url.startswith('blob'):
        blob_responses[url] = response

    page.on("response", handle_response)
    await page.goto(self.url, wait_until='networkidle')
    print('NETWORK IDLE')

    blob_urls = await self.__get_blob_urls(page)

    all_blobs_evt = asyncio.Event()
    awaited_blobs = set(blob_urls)
    # honestly this bit about waiting for blobs might redundant
    # when networkidle, there should be no more blobs coming in
    while not await self.__wait_for_blobs(all_blobs_evt, 3):
        print(awaited_blobs)
        to_delete = []
        for blob_url in awaited_blobs:
          if blob_url in blob_responses:
            to_delete.append(blob_url)
        
        for blob_url in to_delete:
          awaited_blobs.remove(blob_url)
        if len(awaited_blobs) <= 1: 
          all_blobs_evt.set()
    
    buffers: list[bytes] = []
    for page_num, blob_url in enumerate(blob_urls):
      if not page_num or blob_url not in blob_responses: # skip first page since it's empty
        continue
      
      response = blob_responses[blob_url]
      buffers.append(await response.body())

    await context.close()
    await browser.close()
    return buffers

  async def first_scrape(self):
    logger.info(f'First scrape starting for url {self.url}')
    async with async_playwright() as playwright: 
      raws = await self.__get_raws(playwright)
      return raws


# async def main():
#   scraper = PixivScraper("https://comic.pixiv.net/viewer/stories/167987")
#   print(await scraper.first_scrape())
# asyncio.run(main())