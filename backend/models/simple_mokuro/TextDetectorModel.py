import os
import sys
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from models.simple_mokuro.cache import cache
from models.comic_text_detector.inference import TextDetector

class TextDetectorModel():
  _instance = None

  def __new__(self):
    if self._instance is None:
        # TOCONSIDER input_size might be important here
        self._instance = TextDetector(model_path=cache.comic_text_detector, device='cpu', act='leaky')
        
    return self._instance
  
