import json
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from _shared.encoders import NumpyEncoder

def convert_to_img(file):
  """Takes File and turns into img matrix"""
  try:
    return np.array(Image.open(BytesIO(file)))
  except:
    print('Something went wrong with convert_to_img')
    # TODO: raise exception and maybe cancel a task?

def load_json(path):
  with open(path, 'r', encoding='utf-8') as f:
    return json.load(f)
    
def dump_json(obj, path):
  with open(path, 'w', encoding='utf-8') as f:
    json.dump(obj, f, ensure_ascii=False, cls=NumpyEncoder)
  