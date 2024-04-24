import json
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from _shared.encoders import NumpyEncoder

def convert_to_img(file, flags=cv2.IMREAD_COLOR):
  """Takes File and turns into img matrix"""
  return np.array(Image.open(BytesIO(file)))
  # bytes = np.fromfile(file, np.uint8)
  # return cv2.imdecode(bytes, flags)

def load_json(path):
  with open(path, 'r', encoding='utf-8') as f:
    return json.load(f)
    
def dump_json(obj, path):
  with open(path, 'w', encoding='utf-8') as f:
    json.dump(obj, f, ensure_ascii=False, cls=NumpyEncoder)
  