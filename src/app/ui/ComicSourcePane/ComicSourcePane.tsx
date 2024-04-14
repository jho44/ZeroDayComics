import { ComicSource, ComicSourceZ } from "@/app/lib/definitions";
import {
  createRef,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import ComicSourceContext from "../contexts/ComicSource/context";
import styles from "./ComicSourcePane.module.css";

type Props = {
  setLoadingComic: Dispatch<SetStateAction<boolean>>;
};

export default function ComicSourcePane({ setLoadingComic }: Props) {
  /* Constants */
  const sources = [
    {
      label: "Pixiv Web Serial",
      id: ComicSourceZ.enum.PIXIV,
      example: "https://comic.pixiv.net/viewer/stories/167987",
    },
  ];

  /* Context */
  const { setSourceInfo } = useContext(ComicSourceContext);

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
    setLoadingComic(true);

    const urlSearchParams = new URLSearchParams({
      which,
      input: inputVal,
      nextPage: "0",
    });
    const res = await fetch(
      `/api/comic/first_scrape?${urlSearchParams.toString()}`
    );
    const { totalPages, imgs } = await res.json();

    setSourceInfo({
      type: "init",
      totalPages,
      imgs,
      comicUrl: inputVal,
    });
    setLoadingComic(false);
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
