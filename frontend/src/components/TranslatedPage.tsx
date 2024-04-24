import { Buffer } from "buffer";
import { OcrPage } from "../lib/definitions";

type Props = {
  page: OcrPage;
  pageNum: number;
  translated: boolean;
};

export default function TranslatedPage({ page, pageNum, translated }: Props) {
  const src = `data:image/png;base64,${Buffer.from(page.img, "binary").toString(
    "base64"
  )}`;

  return (
    <div className="relative">
      <img
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
        {page.blocks.map(
          ({ box, lines, translation, font_size, vertical }, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                console.log("click handler");
              }}
              className="bg-white absolute border border-red-700 text-black pointer-events-auto overflow-hidden"
              style={{
                width: `${box[2] - box[0]}px`,
                height: `${box[3] - box[1]}px`,
                left: `${box[0]}px`,
                top: `${box[1]}px`,
                fontSize: `${translated ? 12 : font_size}px`,
                zIndex: i,
                writingMode: !translated && vertical ? "vertical-rl" : "unset",
              }}
            >
              {translated
                ? translation
                : lines.map((line, j) => <p key={j}>{line}</p>)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
