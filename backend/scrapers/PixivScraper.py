from abc import ABC, abstractmethod
from typing import List, Any, Union
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

  def __get_pages_data(self):
    url = f"https://comic.pixiv.net/api/app/episodes/{self.episode}/read_v4"
    headers = {
      'Content-Type': 'application/json',
      'referer': self.url,
      'X-Client-Hash': 'be866478176a7d309bca38164ebfb599b96074a3d7aebd0830bfcfed83a8a340',
      'X-Client-Time': '2024-04-20T03:12:13-07:00',
      'X-Requested-With': 'pixivcomic'
    }
    r = requests.get(url, headers=headers)
    return r.json()['data']['reading_episode']['pages']

  def __get_encrypted_img(self, url: str, key: str):
    print({ url, key })
    headers = {
      "referer": "https://comic.pixiv.net/",
      "X-Cobalt-Thumber-Parameter-Gridshuffle-Key": key
    }
    r = requests.get(url, headers=headers, stream=True)
    r.raw.decode_content = True
    im = Image.open(r.raw, 'r').convert('RGBA')

    raw_pixels = list(im.getdata())
    flattened = [item for sublist in raw_pixels for item in sublist]
    return flattened

  async def __get_blob_urls(self, page: Page):
    return await page.locator('div[id^="page-"]').evaluate_all(
      '(divs) => divs.map((div) => div.style.backgroundImage.match(/url\("(.*?)"/)?.[1])'
    )

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

    blob_urls = await self.__get_blob_urls(page)

    buffers: list[bytes] = []
    for page_num, blob_url in enumerate(blob_urls):
      if not page_num or not blob_url: # skip first page since it's empty
        continue
      
      response = blob_responses[blob_url]
      buffers.append(await response.body())

    await context.close()
    await browser.close()
    return buffers

  def __try_decrypt(self):
    pages_data = self.__get_pages_data()
    for page in pages_data[0:1]:
      raw_pixels = self.__get_encrypted_img(page['url'], page['key'])
      f = open("demofile2.txt", "a")
      f.write(','.join(str(x) for x in raw_pixels))
      f.close()

  async def first_scrape(self) -> FirstScrapeRes:
    logger.info(f'First scrape starting for url {self.url}')
    async with async_playwright() as playwright: 
      raws = await self.__get_raws(playwright)
      return raws


# async def main():
#   scraper = PixivScraper("https://comic.pixiv.net/viewer/stories/167987")
#   print(await scraper.first_scrape())
# asyncio.run(main())