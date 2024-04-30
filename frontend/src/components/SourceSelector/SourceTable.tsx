import { createRef, Fragment, RefObject, useEffect, useState } from "react";
import { useSource } from "../../contexts/Source";
import { Source, sources } from "../../lib/definitions";
import styles from "./SourceSelector.module.css";

export default function SourceTable() {
  /* States */
  const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([]);

  /* Hooks */
  const { handleSubmitUI, handleResponse } = useSource();

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
  const handleSubmit = (which: Source, i: number) => {
    const inputVal = inputRefs[i]?.current?.value;
    if (!inputVal) return; // TODO: UI error
    handleSubmitUI();

    fetch("http://localhost:4000/source_chosen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        which,
        input: inputVal,
      }),
    }).then(async (res) => await handleResponse(res));
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
              id={label}
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
