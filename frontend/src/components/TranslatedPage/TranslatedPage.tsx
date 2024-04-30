import { OcrPage } from "../../lib/definitions";
import { SourceBox, TranslatedBox } from "./Boxes";

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
              <TranslatedBox
                block={block}
                pageNum={pageNum}
                blockNum={i}
                key={i}
              />
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
