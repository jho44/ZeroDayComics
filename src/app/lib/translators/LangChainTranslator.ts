import { TranslatorInstance } from "@/app/lib/translators/definitions";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export default class LangChainTranslator implements TranslatorInstance {
  chain: Runnable;
  readonly outputParser = new StringOutputParser();

  constructor(model: any) {
    let prompt;
    if (model instanceof ChatOpenAI) {
      const systemPrompt = `I'm going to give you some text. Please return 2 things: 1. the text separated into coherent sentences and 2. the English translation. Here's an example:

      input: そうこうしているうちに香も過ぎ
      もうすぐルーファス様の誕生日
      
      output:
      Japanese: 
      そうこうしているうちに香も過ぎ。もうすぐルーファス様の誕生日。
      
      English:
      Time passes swiftly as we're occupied with various matters. Lord Rufus's birthday is approaching soon.`;

      prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["user", "{input}"],
      ]);
    } else {
      const systemPrompt = `I'm going to give you some text. Please return 2 things: 1. the text separated into coherent sentences and 2. the English translation. Here's an example:

      input: そうこうしているうちに香も過ぎ
      もうすぐルーファス様の誕生日
      
      output:
      Japanese: 
      そうこうしているうちに香も過ぎ。もうすぐルーファス様の誕生日。
      
      English:
      Time passes swiftly as we're occupied with various matters. Lord Rufus's birthday is approaching soon.`;

      prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["user", "{input}"],
      ]);
    }

    this.chain = prompt.pipe(model).pipe(this.outputParser);
  }

  async translate(text: string) {
    return await this.chain.invoke({
      input: text,
    });
  }
}
