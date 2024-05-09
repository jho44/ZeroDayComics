from aiohttp import web, web_request
from aiohttp_validate import validate
import aiohttp_cors

from Tools import Tools
from RouteHandlers import RouteHandlers

tools = Tools()

handlers = RouteHandlers(tools)

app = web.Application()

cors = aiohttp_cors.setup(app, defaults={
  "http://localhost:3000": aiohttp_cors.ResourceOptions(
    allow_credentials=True,
    expose_headers="*",
    allow_headers="*"
  )
})

routes = web.RouteTableDef()

@routes.post('/files_uploaded')
async def files_uploaded(request):
  return await handlers.on_files_uploaded(request)

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
  return await handlers.on_source_chosen(request)

@routes.post('/translate_line')
async def translate_line(request: web_request.Request):
  return await handlers.on_translate_line(request)

app.add_routes(routes)

for route in list(app.router.routes()):
  cors.add(route)

web.run_app(app, port=4000)
