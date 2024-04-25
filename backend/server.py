from enum import Enum
from loguru import logger

import socketio
from adaptors.MokuroAdaptor import MokuroAdaptor
from adaptors.Adaptor import Adaptor
from translators.Deeplx import Deeplx
from translators.Translator import Translator
from scrapers.PixivScraper import PixivScraper

from aiohttp import web

from utils import dump_json
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

def init_translator():
  translator = Deeplx()
  return translator

def get_adaptor(translator: Translator) -> Adaptor:
  adaptor = MokuroAdaptor(translator)
  return adaptor

async def pipeline_files(files):
  translator = init_translator()
  adaptor = get_adaptor(translator)

  for page_num, file in enumerate(files):
    page = await adaptor.pipeline(file)
    serialized_page = dump_json(page)
    await sio.emit('page_done', { 'pageNum': page_num, 'blks': serialized_page })
    
  await sio.emit('all_pages_done')

@sio.event
async def files_uploaded(sid, files):
  await pipeline_files(files)
  
@sio.event
async def source_chosen(sid, which: Source, input: str):
  try:
    logger.info(f'Source chosen {which} {input}')
    scraper = scrapers[which](input)
    imgs = await scraper.first_scrape()
    logger.info(f'First scrape done {which} {input}')

    await pipeline_files(imgs)
  except Exception as err:
    logger.error('Something went wrong with source_chosen')
    logger.error(err)
    
if __name__ == '__main__':
  # app.cleanup_ctx.append(client_session)
  web.run_app(app, port=4000)
  # asyncio.run(test())

'''
TODO:
decorators to catch exceptions on all route handlers

don't just .gather all lines in Deeplx -- batch by number of...something

share the playwright browser? and translators and adaptors and other classes?
'''