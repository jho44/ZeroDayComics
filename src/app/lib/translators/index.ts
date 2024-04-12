import { AllModelChoices } from "@/app/lib/models/definitions";
import { TranslatorInstance } from "@/app/lib/translators/definitions";
import GPTTranslator from "@/app/lib/translators/GPTTranslator";
import LangChainTranslator from "@/app/lib/translators/LangChainTranslator";
import LLAMATranslator from "./LLAMATranslator";

/*
  would like to have multiple implementation options, e.g.:
    - gpt + langchain
    - huggingface
    - ollama

  Translators = {
    gpt: GPTTranslator,
    hf: HFTranslator
  }

  extend Translator
    translate(text: string)
*/

type TranslatorModelChoices = AllModelChoices.GPT | AllModelChoices.LLAMA;

const TRANSLATORS: {
  [key in TranslatorModelChoices]: new (model: any) => TranslatorInstance;
} = {
  [AllModelChoices.GPT]: LangChainTranslator, // non-functional and untested up to this point 4/11
  [AllModelChoices.LLAMA]: LLAMATranslator,
};

export default class Translator {
  model: TranslatorInstance;

  constructor(modelChoice: TranslatorModelChoices, model: any) {
    this.model = new TRANSLATORS[modelChoice](model);
  }

  translate(text: string) {
    return this.model.translate(text);
  }
}
