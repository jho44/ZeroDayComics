from .Translator import Translator
from openai import OpenAI
import json

class Gpt(Translator):
  _PROMPT_TEMPLATE = "You will be given an array of strings. Each entry is the speech bubble of a comic page. Translate them to English while keeping the page's context in mind. Return a JSON like { result: [TRANSL_1, TRANSL_2, ...] }."

  def __init__(self) -> None:
    self.model = OpenAI()

  def translate(self, lines: list[str]) -> list[str]:
    res = self.model.chat.completions.create(
      model="gpt-3.5-turbo-0125",
      response_format={ "type": "json_object" },
      messages=[
        {"role": "system", "content": self.__get_system_prompt()},
        {"role": "user", "content": json.dumps(lines)}
      ]
    )
    json_res = json.loads(res.choices[0].message.content)
    return json_res['result']

  def __get_system_prompt(self):
    return self._PROMPT_TEMPLATE
