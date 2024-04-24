from abc import ABC, abstractmethod

class Adaptor(ABC):
  @abstractmethod
  def pipeline(self, args) -> tuple[object, list[str]]:
    pass