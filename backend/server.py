from enum import Enum
from loguru import logger

import socketio
from utils import pipeline_files
from scrapers.PixivScraper import PixivScraper

from aiohttp import web

from dotenv import load_dotenv
load_dotenv() 
 
# import aiohttp_cors

sio = socketio.AsyncServer(async_mode='aiohttp', cors_allowed_origins="http://localhost:3000")
app = web.Application()

# cors = aiohttp_cors.setup(app, defaults={
#   "http://localhost:3000": aiohttp_cors.ResourceOptions()
# })
sio.attach(app)

class Source(Enum):
  PIXIV = 0

scrapers = {
  Source.PIXIV.value: PixivScraper
}

@sio.event
async def files_uploaded(sid, files):
  logger.info(f'{len(files)} files uploaded')
  await pipeline_files(files, sio)

@sio.event
async def source_chosen(sid, which: Source, input: str):
  logger.info(f'Source chosen {which} {input}')
  scraper = scrapers[which](input)
  imgs = await scraper.first_scrape()
  logger.info(f'First scrape done {which} {input}')
  await sio.emit('scrape_done', len(imgs))

  await pipeline_files(imgs, sio)

if __name__ == '__main__':
  # app.cleanup_ctx.append(client_session)
  web.run_app(app, port=4000)
  # asyncio.run(test())

'''
TODO:

don't just .gather all lines in Deeplx -- batch by number of...something

share the playwright browser? and translators and adaptors and other classes?
'''