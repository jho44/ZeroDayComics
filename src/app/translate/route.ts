import Translator from "@/app/lib/translators";
import llamaModel from "@/app/lib/models/llamaModel";
import { AllModelChoices } from "@/app/lib/models/definitions";

export async function POST(req: Request) {
  const text = await req.text();
  const translator = new Translator(AllModelChoices.LLAMA, llamaModel);
  const translation = await translator.translate(text);
  return Response.json(translation);
}
