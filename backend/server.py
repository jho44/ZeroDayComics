from enum import Enum
from loguru import logger

import socketio
from adaptors.MokuroAdaptor import MokuroAdaptor
from adaptors.Adaptor import Adaptor
from translators.Gpt import Gpt
from translators.Translator import Translator
from models.simple_mokuro.TextAndBoxDetector import TextAndBoxDetector
from scrapers.PixivScraper import PixivScraper

from aiohttp import web
from PIL import Image

from utils import get_blocks, dump_json
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
async def source_chosen(sid, which: Source, input: str):
  logger.info(f'Source chosen {which} {input}')
  # scraper = scrapers[which](input)
  # imgs = await scraper.first_scrape()
  
  # for idx, img in enumerate(imgs):
  #   with open(f"{idx}.jpeg", "wb") as binary_file:
  #     binary_file.write(img)
  imgs = [Image.open('tmp/0.jpeg').tobytes()]
  logger.info(f'TYPE {type(imgs[0])}')
  logger.info(f'First scrape done {which} {input}')

  await sio.emit('ocr', len(imgs))
  detector = TextAndBoxDetector()
  blks = detector(imgs)

  await sio.emit('done', blks)

# from multiprocessing import Pool, Lock
# import os

# async def files_uploaded_helper(img):
#   blks = get_blocks(img)
#   upload_lock.acquire()
#   try:
#     await sio.emit('page_done', { 'pageNum': page_num, 'blks': blks })
#   finally:
#     upload_lock.release()
  
def init_translator():
  translator = Gpt()
  return translator

def get_adaptor(translator: Translator) -> Adaptor:
  adaptor = MokuroAdaptor(translator)
  return adaptor

@sio.event
async def files_uploaded(sid, files):
  translator = init_translator()
  adaptor = get_adaptor(translator)

  for page_num, file in enumerate(files):
    page = adaptor.pipeline(file)
    serialized_page = dump_json(page)
    await sio.emit('page_done', { 'pageNum': page_num, 'blks': serialized_page })
    
  await sio.emit('all_pages_done')
  
  # # Value -- num pages done
  # # socket
  # def init(l):
  #   global upload_lock
  #   upload_lock = l

  # # with Pool(len(os.sched_getaffinity(0))) as p:
  # #   print(p.map(get_blocks, files))

  # PROCESSES = len(os.sched_getaffinity(0))

  # print('Creating pool with %d processes\n' % PROCESSES)
  # lock = Lock()
  # pool = Pool(initializer=init, initargs=(lock,))

  # pool.imap_unordered(get_blocks, files)

  # pool.close()
  # pool.join()
  # print('######## DOWN HERE! ########')


if __name__ == '__main__':
  web.run_app(app, port=4000)
