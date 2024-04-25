from models.simple_mokuro.utils import convert_to_img, dump_json
from models.simple_mokuro.TextDetectorModel import TextDetectorModel
from models.simple_mokuro.MangaOcrModel import MangaOcrModel
import cv2
from PIL import Image
from loguru import logger
from scipy.signal.windows import gaussian
import numpy as np

class TextAndBoxDetector:
  def __init__(self):
    self.ocr = None

    self.text_height=64
    self.max_ratio_vert=16
    self.max_ratio_hor=8
    self.anchor_window=2
    
  def init_models(self):
    if not self.ocr:
      self.ocr = MangaOcrModel()
      self.text_detector = TextDetectorModel()
  
  def transform_input(self, files):
    res = []
    for file in files:
      res.append(convert_to_img(file))
    return res
  
  def process_page(self, img):
    H, W, *_ = img.shape
    result = {'img_width': W, 'img_height': H, 'blocks': []}

    mask, mask_refined, blk_list = self.text_detector(img, refine_mode=1, keep_undetected_mask=True)
    for blk_idx, blk in enumerate(blk_list):
      result_blk = {'box': list(blk.xyxy), 'vertical': blk.vertical, 'font_size': blk.font_size, 'lines_coords': [], 'lines': []}

      for line_idx, line in enumerate(blk.lines_array()):
        if blk.vertical:
          max_ratio = self.max_ratio_vert
        else:
          max_ratio = self.max_ratio_hor

        line_crops, cut_points = self.split_into_chunks(img, mask_refined, blk, line_idx, textheight=self.text_height, max_ratio=max_ratio, anchor_window=self.anchor_window)

        line_text = ''
        for line_crop in line_crops:
          if blk.vertical:
            line_crop = cv2.rotate(line_crop, cv2.ROTATE_90_CLOCKWISE)
          line_text += self.ocr(Image.fromarray(line_crop))

        result_blk['lines_coords'].append(line.tolist())
        result_blk['lines'].append(line_text)

      result['blocks'].append(result_blk)

    return result
    
  def __call__(self, file):
    # TODO filter out files which aren't imgs
    # TODO error check imgs -- have yet to know what faulty img looks like tho
    
    img = convert_to_img(file)
    # TOCONSIDER maybe consider whether json alr exists for this chapter?
    self.init_models()
    try:
      result = self.process_page(img)
      result['img'] = file
    except Exception as e:
      logger.error(f'Failed OCR of file "{img}": {e}')
      return None
    # dump_json(result, 'tmp/_ocr/' + filename.split('.')[0] + '.json')
    return result
    
  @staticmethod
  def split_into_chunks(img, mask_refined, blk, line_idx, textheight, max_ratio=16, anchor_window=2):
    line_crop = blk.get_transformed_region(img, line_idx, textheight)

    h, w, *_ = line_crop.shape
    ratio = w / h

    if ratio <= max_ratio:
      return [line_crop], []

    else:
      k = gaussian(textheight * 2, textheight / 8)

      line_mask = blk.get_transformed_region(mask_refined, line_idx, textheight)
      num_chunks = int(np.ceil(ratio / max_ratio))

      anchors = np.linspace(0, w, num_chunks + 1)[1:-1]

      line_density = line_mask.sum(axis=0)
      line_density = np.convolve(line_density, k, 'same')
      line_density /= line_density.max()

      anchor_window *= textheight

      cut_points = []
      for anchor in anchors:
        anchor = int(anchor)

        n0 = np.clip(anchor - anchor_window // 2, 0, w)
        n1 = np.clip(anchor + anchor_window // 2, 0, w)

        p = line_density[n0:n1].argmin()
        p += n0

        cut_points.append(p)

      return np.split(line_crop, cut_points, axis=1), cut_points
