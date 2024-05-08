import asyncio
from typing import Any
from loguru import logger

from Tools import Tools
from utils import dump_json
from models.simple_mokuro.TextAndBoxDetector import TextAndBoxDetector as Mokuro
from aiohttp import web, web_request
import re

"""
init this once when start up server
"""
class PipelineHandlers:

  def __init__(self, tools: Tools) -> None:
    self.tools = tools

  async def __get_files_from_req(self, request: web_request.Request):
    reader = await request.multipart()
    
    files = []
    while True:
      part = await reader.next()

      if part is None or part.name != 'files[]' or re.search("image/*", part.headers['Content-Type']) is None:
        break 
      files.append(await part.read())
    return files
  
  async def __parse_request(self, request: web_request.Request):
    path = request.path
    if path == '/source_chosen':
      payload = await request.json()
      which = payload['which']
      input = payload['input']
      return which, input
    
    if path == '/files_uploaded':
      return await self.__get_files_from_req(request)
    
    raise Exception('Invalid route', request)
  
  async def __stream_res(self, res: web.StreamResponse, event_name: str, payload: dict[str, Any] = {}):
    payload['event'] = event_name
    await res.write(dump_json(payload).encode())

  async def __pipeline(self, files, res: web.StreamResponse, translator_type = 'deeplx', adaptor_type = 'mokuro'):
    translator = self.tools.translators[translator_type]
    adaptor = self.tools.adaptors[adaptor_type](translator)

    try:
      for page_num, file in enumerate(files):
        page = await adaptor.pipeline(file)
        logger.info(f'Page done {page_num}')
        await self.__stream_res(res, 'page_done', { 'pageNum': page_num, 'blks': page })
        await asyncio.sleep(1)
      await self.__stream_res(res, 'all_pages_done')
    except Exception as ex:
      logger.error(f'Something went wrong with the pipeline:\n{ex}')
      await self.__stream_res(res, 'error')

  async def on_files_uploaded(self, request: web_request.Request):
    files = await self.__parse_request(request)
    logger.info(f'{len(files)} files uploaded')

    resp = web.StreamResponse()
    await resp.prepare(request)
    await self.__pipeline(files, resp)
    await resp.write_eof()
    return resp
  
  async def on_source_chosen(self, request: web_request.Request):
    which, input = await self.__parse_request(request)
    logger.info(f'Source chosen {which} {input}')
    scraper = self.tools.scrapers[which](input)
    imgs = await scraper.first_scrape()
    logger.info(f'First scrape done {which} {input}')
    
    resp = web.StreamResponse()
    await resp.prepare(request)
    await self.__stream_res(resp, 'scrape_done', { 'numPages': len(imgs) })
    await self.__pipeline(imgs, resp)
    await resp.write_eof()
    return resp