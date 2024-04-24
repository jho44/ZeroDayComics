from manga_ocr import MangaOcr

class MangaOcrModel(object):
  _instance = None

  def __new__(self):
    if self._instance is None:
        self._instance = MangaOcr(force_cpu = True)
        
    return self._instance
