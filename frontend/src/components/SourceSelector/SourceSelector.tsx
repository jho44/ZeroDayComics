import { Source, sources } from "../../lib/definitions";
import {
  createRef,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./SourceSelector.module.css";
import Upload from "./Upload";
import { socket } from "../../socket";

type Props = {
  handleSubmitUI: () => void;
  handleOcrStartUI: (_totalPages: number) => void;
  handlePageDoneUI: (page: { pageNum: number; blks: string }) => void;
  handleAllPagesDoneUI: () => void;
};

export default function SourceSelector({
  handleSubmitUI,
  handleOcrStartUI,
  handlePageDoneUI,
  handleAllPagesDoneUI,
}: Props) {
  /* Context */
  // const { setSourceInfo } = useContext(ComicSourceContext);

  /* States */
  const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([]);

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

    const onOcrStarting = (totalPages: number) => {
      console.log("done scraping -- ocr starting");
      handleOcrStartUI(totalPages);
      socket.off("ocr", onOcrStarting);
    };

    const onPageDone = (page: { pageNum: number; blks: string }) => {
      handlePageDoneUI(page);
      socket.off("page_done", onPageDone);
      socket.disconnect();
    };

    socket.connect();
    socket.on("ocr", onOcrStarting);
    socket.emit("source_chosen", which, inputVal);

    socket.on("page_done", onPageDone);
  };

  return (
    <div className="w-full h-full">
      <div className={styles.sourceTable}>
        {sources.map(({ label, id, example }, i) => (
          <div className={styles.row} key={id}>
            <div>{label}</div>
            <div>
              <input type="text" placeholder={example} ref={inputRefs[i]} />
            </div>
            {/* document.querySelector('a[href^="/viewer"]') */}
            <div>
              <button onClick={() => handleSubmit(id, i)}>Enter</button>
            </div>
          </div>
        ))}
      </div>
      <Upload
        handleOcrStartUI={handleOcrStartUI}
        handlePageDoneUI={handlePageDoneUI}
        handleAllPagesDoneUI={handleAllPagesDoneUI}
      />
    </div>
  );
}
