from _shared.encoders import NumpyEncoder
import json

def dump_json(obj):
  return json.dumps(obj, cls=NumpyEncoder)
