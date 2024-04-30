from _shared.encoders import NumpyEncoder
from models.simple_mokuro.TextAndBoxDetector import TextAndBoxDetector as Mokuro
from translators.Translator import Translator
from .Adaptor import Adaptor
import json

class MokuroAdaptor(Mokuro, Adaptor):
  def __init__(self, translator: Translator):
    super().__init__()
    self.translator = translator

  async def pipeline(self, args):
    page = self.__call__(args)
    # page: { blocks: { lines: string[] }[] }

    # for block in page['blocks']:
    #   block['translation'] = self.translator.translate("\n".join(block['lines']))
    lines = ["\n".join(block['lines']) for block in page['blocks']]
    translations = await self.translator.translate(lines)
    page['transl_blocks'] = json.loads(json.dumps(page['blocks'], cls=NumpyEncoder))
    for block, transl in zip(page['transl_blocks'], translations):
      block['lines'] = [transl]
      block['font_size'] = 12
      block['vertical'] = False

    return page
