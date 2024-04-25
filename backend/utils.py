from _shared.encoders import NumpyEncoder
from models.simple_mokuro.TextAndBoxDetector import TextAndBoxDetector
import json

def dump_json(obj):
  return json.dumps(obj, ensure_ascii=False, cls=NumpyEncoder)