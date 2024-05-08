from dataclasses import dataclass, field
from enum import Enum
from typing import Any
from adaptors.MokuroAdaptor import MokuroAdaptor
from adaptors.Adaptor import Adaptor
from scrapers.PixivScraper import PixivScraper, Scraper
from translators.Deeplx import Deeplx
from translators.Gpt import Gpt
from translators.Translator import Translator
from models.simple_mokuro.TextAndBoxDetector import TextAndBoxDetector as Mokuro

class Source(Enum):
  PIXIV = 0

@dataclass
class Tools:
  translators: dict[str, Translator] = field(default_factory=lambda: {'gpt': Gpt(), 'deeplx': Deeplx()})

  ocr_models: dict[str, Any] = field(default_factory=lambda: {'mokuro': Mokuro()})

  adaptors: dict[str, Adaptor] = field(default_factory=lambda: {'mokuro': MokuroAdaptor})

  scrapers: dict[Source, Scraper] = field(default_factory=lambda: {Source.PIXIV.value: PixivScraper})