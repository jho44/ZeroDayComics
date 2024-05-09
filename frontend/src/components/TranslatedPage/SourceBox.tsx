import { useRef, useState } from "react";
import { useBox } from "../../contexts/Box";
import EditorToolbar from "./Toolbars/SourceBoxToolbar";
import { useViewer } from "../../contexts/Viewer";

export default function SourceBox({
  flipTranslSrc,
}: {
  flipTranslSrc: () => void;
}) {
  // TODO: clean this up
  // this also lives in useMoveable
  const PADDING = 10;

  /* Refs */
  const boxRef = useRef<HTMLDivElement | null>(null);

  /* Contexts */
  const {
    handleSrcTextEdit: saveEdit,
    handleTranslationChange: saveTranslation,
  } = useViewer();
  const { srcBlock: block, imgWidth, blockNum, pageNum } = useBox();
  const { box, lines, vertical } = block;

  /* States */
  const [hovering, setHovering] = useState(false);
  const [fontSize, setFontSize] = useState(block.font_size);
  const [opacity, setOpacity] = useState(1);

  /* Computed */
  const width = box[2] - box[0];
  const height = box[3] - box[1];

  /* Methods */
  const handleFontSizeChange = (diff: number) => {
    setFontSize((_fontSize) => {
      const newFontSize = _fontSize + diff;
      if (newFontSize < 6 || newFontSize > 32) return _fontSize;

      // saveNewFontSize({ blockNum, pageNum, newFontSize });
      return newFontSize;
    });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseInt(e.target.value) / 100);
  };

  const handleLineChange = (lineNum: number, val: string) => {
    saveEdit({ pageNum, blockNum, lineNum, val });
  };

  const retranslate = async () => {
    const line = boxRef.current?.innerText.replace(/\n\n/g, "");
    if (!line) return;

    await fetch("http://localhost:4000/translate_line", {
      method: "POST",
      body: JSON.stringify({
        line,
      }),
    })
      .then((res) => res.text())
      .then((res) => saveTranslation({ blockNum, pageNum, val: res }))
      .catch((err) =>
        console.error(`Something went wrong with translating line ${line}`, err)
      );
  };

  return (
    <div
      className="pointer-events-auto"
      onMouseLeave={() => setHovering(false)}
    >
      <div
        onMouseOver={(e) => {
          if (
            document
              .getElementById(`toolbar-${pageNum}-${blockNum}`)
              ?.contains(e.target as Node)
          ) {
            setHovering(false);
            return;
          }

          setHovering(true);
        }}
        onMouseLeave={(e) => {
          if (
            (e.relatedTarget as HTMLElement)?.classList?.contains(
              "moveable-direction"
            )
          )
            return;
          setHovering(false);
        }}
        className="absolute"
        style={{
          right: `${imgWidth - box[0] - width - PADDING}px`,
          top: `${box[1] - PADDING}px`,
          border: `${PADDING}px solid transparent`,
          zIndex: blockNum,
          transform: block.transform?.transform,
        }}
      >
        <EditorToolbar
          pageNum={pageNum}
          blockNum={blockNum}
          handleFontSizeChange={handleFontSizeChange}
          hoveringOnTarget={hovering}
          flipTranslSrc={flipTranslSrc}
          handleOpacityChange={handleOpacityChange}
          retranslate={retranslate}
        />
        <div
          ref={boxRef}
          className="bg-white border border-red-700 text-black"
          style={{
            opacity,
            minWidth: `${width}px`,
            minHeight: `${height}px`,
            fontSize: `${fontSize}px`,
            writingMode: vertical
              ? ("vertical-rl" as const)
              : ("unset" as const),
          }}
        >
          {lines.map((line, j) => (
            <p
              key={j}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleLineChange(j, e.currentTarget.innerText)}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
