import { ChatOllama } from "@langchain/community/chat_models/ollama";

const llamaModel = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "gemma:2b",
});

export default llamaModel;
