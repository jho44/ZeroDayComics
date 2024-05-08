from translators.Deeplx import Deeplx
from translators.Gpt import Gpt
from translators.Translator import Translator
from models.simple_mokuro.TextAndBoxDetector import TextAndBoxDetector as Mokuro

class Tools:
  translators: dict[str, Translator] = {
    'gpt': Gpt(),
    'deeplx': Deeplx()
  }

  ocr_models = {
    'mokuro': Mokuro()
  }