import { useState } from "react";
import { OcrPage } from "./definitions";

export default function usePipeline() {
  /* States */
  const [loading, setLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<OcrPage[]>([]);

  /* Methods */
  const handleSubmitUI = (payload?: { numPages: number }) => {
    setLoading(true);
    if (payload) setPages(new Array(payload.numPages).fill(null));
  };

  const handlePageDoneUI = ({
    pageNum,
    blks,
  }: {
    pageNum: number;
    blks: OcrPage;
  }) => {
    setPages((_pages) => [
      ..._pages.slice(0, pageNum),
      blks,
      ..._pages.slice(pageNum + 1),
    ]);
  };

  const handleAllPagesDoneUI = () => {
    setLoading(false);
  };

  const handleError = () => {
    console.error("Unhandled server event");
    // TODO: UI handling
  };

  const handleEvent = (line: string) => {
    const { event, ...payload } = JSON.parse(line);
    console.log(event);
    console.log(payload);

    if (event == "page_done") {
      handlePageDoneUI(payload);
    } else if (event == "all_pages_done") {
      handleAllPagesDoneUI();
    } else if (event == "scrape_done") {
      handleSubmitUI(payload);
    } else if (event == "error") {
      handleError();
    } else {
      console.error("Unhandled server event", event);
    }
  };

  const handleResponse = async (res: Response) => {
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let partial = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const lines = decoder.decode(value).split(/\n/);
      for (const line of lines) {
        partial += line;
        try {
          handleEvent(partial);
          partial = "";
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  return {
    loading,
    pages,
    handleSubmitUI,
    handleResponse,
  };
}