from aiohttp import web, web_request
from aiohttp_validate import validate
import aiohttp_cors
import re
from loguru import logger

from utils import pipeline, scrapers, streamRes

async def parse_request(request: web_request.Request):
  path = request.path
  if path == '/source_chosen':
    payload = await request.json()
    which = payload['which']
    input = payload['input']
    return which, input
  
  if path == '/files_uploaded':
    return await get_files_from_req(request)
  
  raise Exception('Invalid route', request)

app = web.Application()

cors = aiohttp_cors.setup(app, defaults={
  "http://localhost:3000": aiohttp_cors.ResourceOptions(
    allow_credentials=True,
    expose_headers="*",
    allow_headers="*"
  )
})

routes = web.RouteTableDef()

async def get_files_from_req(request: web_request.Request):
  reader = await request.multipart()
  
  files = []
  while True:
    part = await reader.next()

    if part is None or part.name != 'files[]' or re.search("image/*", part.headers['Content-Type']) is None:
      break 
    files.append(await part.read())
  return files

@routes.post('/files_uploaded')
async def files_uploaded(request):
  files = await parse_request(request)
  logger.info(f'{len(files)} files uploaded')

  resp = web.StreamResponse()
  await resp.prepare(request)
  await pipeline(files, resp)
  await resp.write_eof()
  return resp

@validate(
  request_schema={
    "type": "object",
    "properties": {
      "which": {
        "type": "number",
      },
      "input": {
        "type": "string"
      }
    },
    "required": ["which", "input"],
    "additionalProperties": False
  }
)
@routes.post('/source_chosen')
async def source_chosen(request: web_request.Request):
  which, input = await parse_request(request)
  logger.info(f'Source chosen {which} {input}')
  scraper = scrapers[which](input)
  imgs = await scraper.first_scrape()
  logger.info(f'First scrape done {which} {input}')
  
  resp = web.StreamResponse()
  await resp.prepare(request)
  await streamRes(resp, 'scrape_done', { 'numPages': len(imgs) })
  await pipeline(imgs, resp)
  await resp.write_eof()
  return resp

app.add_routes(routes)
# app.add_routes([web.post('/scrape', scrape)])

for route in list(app.router.routes()):
  cors.add(route)

web.run_app(app, port=4000)
