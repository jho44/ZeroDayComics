from _shared.encoders import NumpyEncoder
from adaptors.MokuroAdaptor import MokuroAdaptor
from adaptors.Adaptor import Adaptor
from translators.Deeplx import Deeplx
from translators.Translator import Translator
import json
from loguru import logger

def dump_json(obj):
  return json.dumps(obj, ensure_ascii=False, cls=NumpyEncoder)

def init_translator():
  translator = Deeplx()
  return translator

def get_adaptor(translator: Translator) -> Adaptor:
  adaptor = MokuroAdaptor(translator)
  return adaptor

async def pipeline_files(files, sio):
  try:
    translator = init_translator()
    adaptor = get_adaptor(translator)

    for page_num, file in enumerate(files):
      page = await adaptor.pipeline(file)
      serialized_page = dump_json(page)
      logger.info(f'Page done {page_num}')
      await sio.emit('page_done', { 'pageNum': page_num, 'blks': serialized_page })
      
    await sio.emit('all_pages_done')
  except Exception as ex:
    logger.error(f'Something went wrong with the pipeline:\n{ex}')
    await sio.emit('error')