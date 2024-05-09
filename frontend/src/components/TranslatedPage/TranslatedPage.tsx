import { BoxContext } from "../../contexts/Box";
import { OcrPage } from "../../lib/definitions";
import BoxWrapper from "./BoxWrapper";

type Props = {
  page: OcrPage;
  pageNum: number;
  translated: boolean;
  onLoadImg?: () => void;
};

export default function TranslatedPage({
  page,
  pageNum,
  onLoadImg = () => {},
}: Props) {
  /* Computed */
  const src = `data:image/webp;base64,${page.img}`;

  return (
    <div id={`page-${pageNum}`} className="relative">
      <img
        onLoad={onLoadImg}
        alt={`Page ${pageNum}`}
        src={src}
        style={{
          minWidth: `${page.img_width}px`,
          minHeight: `${page.img_height}px`,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${page.img_width}px`,
          height: `${page.img_height}px`,
        }}
      >
        {page.blocks.map((block, blockNum) => (
          <BoxContext.Provider
            value={{
              imgWidth: page.img_width,
              srcBlock: block,
              translBlock: page.transl_blocks[blockNum],
              blockNum,
              pageNum,
            }}
            key={blockNum}
          >
            <BoxWrapper />
          </BoxContext.Provider>
        ))}
      </div>
    </div>
  );
}
