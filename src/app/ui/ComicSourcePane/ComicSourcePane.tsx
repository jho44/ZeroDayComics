import { ComicSource, ComicSourceZ } from "@/app/lib/definitions";
import {
  createRef,
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import styles from "./ComicSourcePane.module.css";
import { ComicSourceContext } from "../Contexts";

type Props = {
  setLoadingComic: Dispatch<SetStateAction<boolean>>;
  // latestRetrievedPage: MutableRefObject<number>;
};

export default function ComicSourcePane({ setLoadingComic }: Props) {
  /* Constants */
  const sources = [
    {
      label: "Pixiv Web Serial",
      id: ComicSourceZ.enum.PIXIV,
      example: "https://comic.pixiv.net/store/variants/ngu24w1kg",
    },
  ];

  /* Context */
  const { latestRetrievedPage, setLatestRetrievedPage } =
    useContext(ComicSourceContext);

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
  }, [sources.length]);

  /* Methods */
  const handleSubmit = async (which: ComicSource, i: number) => {
    const inputVal = inputRefs[i]?.current?.value;
    if (!inputVal) return; // TODO: UI error
    // setLoadingComic(true);

    const urlSearchParams = new URLSearchParams({
      which,
      input: inputVal,
      latestRetrievedPage: latestRetrievedPage.toString(),
    });
    const res = await fetch(
      `/api/comic/first_scrape?${urlSearchParams.toString()}`
    );
    const { totalPages, imgs } = await res.json();
    setLatestRetrievedPage((prev) => prev + imgs.length);
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
    </div>
  );
}
