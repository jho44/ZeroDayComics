from .Translator import Translator
import json
from aiohttp import ClientSession
import asyncio

class Deeplx(Translator):
  _PROMPT_TEMPLATE = "You will be given an array of strings. Each entry is the speech bubble of a comic page. Translate them to English while keeping the page's context in mind. Return a JSON like { result: [TRANSL_1, TRANSL_2, ...] }."

  async def _request_translation(self, session: ClientSession, line: str) -> str:
    post_data = json.dumps({
      "text": line,
      "source_lang": "JA",
      "target_lang": "EN"
    })
    async with session.post("http://127.0.0.1:1188/translate", data=post_data) as res:
      json_res = await res.json()
      return json_res['data']
    
  async def translate(self, lines: list[str]) -> list[str]:
    async with ClientSession() as session:
        return await asyncio.gather(
          *[self._request_translation(session, line) for line in lines]
        )
