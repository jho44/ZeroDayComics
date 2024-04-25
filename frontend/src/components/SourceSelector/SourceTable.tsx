import { useState, RefObject, useEffect, createRef, Fragment } from "react";
import { Source, sources } from "../../lib/definitions";
import styles from "./SourceSelector.module.css";
import { socket } from "../../socket";
import { useSource } from "../../contexts/Source";

export default function SourceTable() {
  /* States */
  const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([]);

  /* Hooks */
  const { handleSubmitUI, handlePageDoneUI, handleAllPagesDoneUI } =
    useSource();

  /* Lifecycle Methods */
  useEffect(() => {
    // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
    setInputRefs((inputRefs) =>
      Array(sources.length)
        .fill(null)
        .map((_, i) => inputRefs[i] || createRef())
    );
  }, []);

  /* Methods */
  const handleSubmit = async (which: Source, i: number) => {
    const inputVal = inputRefs[i]?.current?.value;
    if (!inputVal) return; // TODO: UI error
    handleSubmitUI();

    const onPageDone = (res: { pageNum: number; blks: string }) => {
      handlePageDoneUI(res);
    };

    const onAllPagesDone = () => {
      handleAllPagesDoneUI();
      socket.off("page_done", onPageDone);
      socket.off("all_pages_done", onAllPagesDone);
      socket.disconnect();
    };
    socket.connect();
    socket.on("page_done", onPageDone);
    socket.on("all_pages_done", onAllPagesDone);
    socket.emit("source_chosen", which, inputVal);

    socket.on("page_done", onPageDone);
  };

  return (
    <div
      className={`${styles.sourceTable} grid-cols-[1fr] sm:grid-cols-[auto_1fr]`}
    >
      {sources.map(({ label, id, example }, i) => (
        <Fragment key={id}>
          <div className="text-left sm:flex sm:justify-center sm:items-center">
            {label}
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={example}
              ref={inputRefs[i]}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(id, i);
              }}
            />

            <button onClick={() => handleSubmit(id, i)}>Enter</button>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
