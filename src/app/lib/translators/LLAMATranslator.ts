import { TranslatorInstance } from "@/app/lib/translators/definitions";
import {
  StringOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export default class LLAMATranslator implements TranslatorInstance {
  sentenceSeparatorChain: Runnable;
  translatorChain: Runnable;
  readonly outputParser = new StringOutputParser();
  // StructuredOutputParser.fromNamesAndDescriptions({
  //   sentences:
  //     "user's input separated into sentences; should be a paragraph rather than a list",
  //   translation: "English translation of the user's input",
  // });

  constructor(model: any) {
    const sentenceSeparatorSysPrompt =
      "Separate the input text into sentences. Return these sentences as a paragraph rather than a list.";

    const sentenceSeparatorPrompt = ChatPromptTemplate.fromMessages([
      ["system", sentenceSeparatorSysPrompt],
      ["user", "{input}"],
    ]);

    this.sentenceSeparatorChain = sentenceSeparatorPrompt
      .pipe(model)
      .pipe(this.outputParser);

    const translatorSysPrompt = "Translate the input into English.";

    const translatorPrompt = ChatPromptTemplate.fromMessages([
      ["system", translatorSysPrompt],
      ["user", "{input}"],
    ]);

    this.translatorChain = translatorPrompt.pipe(model).pipe(this.outputParser);
  }

  async translate(text: string) {
    const [sentences, translation] = await Promise.all([
      this.sentenceSeparatorChain.invoke({
        input: text,
      }),
      this.translatorChain.invoke({
        input: text,
      }),
    ]);

    return {
      sentences,
      translation,
    };
  }
}
