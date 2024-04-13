"use client";

import { useState } from "react";
import LoadingCircle from "./icons/LoadingCircle";

export default function TranslationPane() {
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<string[]>([]);

  const latestOgText = [
    "でも贈り物の",

    "センスがなくて",

    "毎年悩みに悩んで",

    "いるのよね",
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        body: latestOgText.join("\n"),
      });
      const { translation, sentences } = await res.json();
      setHistory((h) => [...h, sentences, translation]);
    } catch (err) {
      console.error("Something went wrong with the translation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {history.map((text, i) => {
        return (
          <div key={i}>
            <span>{i % 2 ? "Translation" : "Original"}: </span>
            <span>{text}</span>
          </div>
        );
      })}
      <button
        className="disabled:bg-gray-600 absolute right-4 bottom-4 bg-green-400 px-4 py-2 text-black rounded-xl cursor-pointer"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <LoadingCircle /> : "Submit"}
      </button>
    </div>
  );
}
