import json
import numpy as np
import base64

class NumpyEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, np.ndarray):
      return obj.tolist()
    if isinstance(obj, np.generic):
      return obj.item()
    if isinstance(obj, bytearray):
      obj = bytes(obj)
    if isinstance(obj, bytes):
      return base64.b64encode(obj).decode("utf-8")
    return json.JSONEncoder.default(self, obj)