from _shared.encoders import NumpyEncoder
from adaptors.MokuroAdaptor import MokuroAdaptor
from adaptors.Adaptor import Adaptor
# from translators.Gpt import Gpt
from translators.Deeplx import Deeplx
from translators.Translator import Translator
import json
from loguru import logger
from typing import Any
from enum import Enum
from scrapers.PixivScraper import PixivScraper
import asyncio
from aiohttp import web

class Source(Enum):
  PIXIV = 0

scrapers = {
  Source.PIXIV.value: PixivScraper
}

def dump_json(obj):
  return json.dumps(obj, cls=NumpyEncoder)

def init_translator():
  translator = Deeplx()
  return translator

def get_adaptor(translator: Translator) -> Adaptor:
  adaptor = MokuroAdaptor(translator)
  return adaptor

async def streamRes(res: web.StreamResponse, event_name: str, payload: dict[str, Any] = {}):
  payload['event'] = event_name
  await res.write(dump_json(payload).encode())

async def pipeline(files, res: web.StreamResponse):
  try:
    translator = init_translator()
    adaptor = get_adaptor(translator)

    for page_num, file in enumerate(files):
      page = await adaptor.pipeline(file)
      logger.info(f'Page done {page_num}')
      await streamRes(res, 'page_done', { 'pageNum': page_num, 'blks': page })
      await asyncio.sleep(1)
    await streamRes(res, 'all_pages_done')
  except Exception as ex:
    logger.error(f'Something went wrong with the pipeline:\n{ex}')
    await streamRes(res, 'error')