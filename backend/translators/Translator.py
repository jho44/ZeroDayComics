from abc import ABC, abstractmethod

class Translator(ABC):

  @abstractmethod
  def translate(self, lines: list[str]) -> list[str]:
    pass
