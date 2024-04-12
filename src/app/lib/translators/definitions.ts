export interface TranslatorInstance {
  translate(text: string): Promise<{ translation: string; sentences: string }>;
}
