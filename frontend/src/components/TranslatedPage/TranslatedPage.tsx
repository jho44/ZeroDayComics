import { Fragment } from "react";
import { OcrPage } from "../../lib/definitions";
import TranslatedBox from "./TranslatedBox";
import SourceBox from "./SourceBox";

type Props = {
  page: OcrPage;
  pageNum: number;
  translated: boolean;
  onLoadImg?: () => void;
};

export default function TranslatedPage({
  page,
  pageNum,
  translated,
  onLoadImg = () => {},
}: Props) {
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
        {translated
          ? page.transl_blocks.map((block, i) => (
              <Fragment key={i}>
                <TranslatedBox
                  block={block}
                  pageNum={pageNum}
                  blockNum={i}
                  key={i}
                />
                {/* <div
                  className="bg-white absolute"
                  style={{
                    width: `${
                      block.transform?.width ?? block.box[2] - block.box[0]
                    }px`,
                    height: `${
                      block.transform?.height ?? block.box[3] - block.box[1]
                    }px`,
                    left: `${block.box[0]}px`,
                    top: `${block.box[1]}px`,
                  }}
                /> */}
              </Fragment>
            ))
          : page.blocks.map(({ box, lines, font_size, vertical }, i) => (
              <SourceBox
                key={i}
                box={box}
                lines={lines}
                fontSize={font_size}
                vertical={vertical}
                boxNum={i}
              />
            ))}
      </div>
    </div>
  );
}
