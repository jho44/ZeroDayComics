import { useRef, useState } from "react";
import Moveable, { OnDragEnd, OnResizeEnd } from "react-moveable";
import { useViewer } from "../../contexts/Viewer";
import { Block } from "../../lib/definitions";
import EditorToolbar from "./EditorToolbar";

const parseTransform = (transform: string | undefined) => {
  return (
    transform?.match(/-?\d+(\.\d+)?/g)?.map((x) => parseFloat(x)) ?? [0, 0]
  );
};

export default function TranslatedBox({
  block,
  pageNum,
  blockNum,
}: {
  block: Block;
  pageNum: number;
  blockNum: number;
}) {
  /* 
    Notes: WHILE resizing and dragging, will perform transforms and size changes to target itself
    on resize and drag end, apply the transforms and size changes to the parent instead
    intent on having a parent around the child bc want an invisible border we can hover over to activate box edges
  */

  /* Contexts */
  const {
    handleBoxDragResize,
    handleTextEdit,
    handleFontSizeChange: saveNewFontSize,
  } = useViewer();

  /* States */
  const [hovering, setHovering] = useState(false);
  const [fontSize, setFontSize] = useState(block.font_size);
  const [popperOpen, setPopperOpen] = useState(false);

  /* Refs */
  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  /* Computed */
  const width = block.transform?.width ?? block.box[2] - block.box[0];
  const height = block.transform?.height ?? block.box[3] - block.box[1];
  const PADDING = 10;

  /* Methods */
  const shiftTransformToParent = (e: OnDragEnd | OnResizeEnd) => {
    const [pDx, pDy] = parseTransform(e.target.parentElement!.style.transform);
    const [cDx, cDy] = parseTransform(e.target.style.transform);

    const transform = `translate(${pDx + cDx}px, ${pDy + cDy}px)`;
    e.target.parentElement!.style.transform = transform;
    e.target.style.transform = "";
    return transform;
  };

  const handleFontSizeChange = (diff: number) => {
    setFontSize((_fontSize) => {
      const newFontSize = _fontSize + diff;
      if (newFontSize < 6 || newFontSize > 32) return _fontSize;

      saveNewFontSize({ blockNum, pageNum, newFontSize });
      return newFontSize;
    });
  };

  return (
    <div
      className="pointer-events-auto"
      onMouseLeave={() => setHovering(false)}
    >
      <div
        onMouseEnter={() => setHovering(true)}
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
          width: `${width + PADDING * 2}px`,
          height: `${height + PADDING * 2}px`,
          left: `${block.box[0] - PADDING}px`,
          top: `${block.box[1] - PADDING}px`,
          border: `${PADDING}px solid transparent`,
          zIndex: blockNum,
          transform: block.transform?.transform,
        }}
      >
        <EditorToolbar
          handleFontSizeChange={handleFontSizeChange}
          hoveringOnTarget={hovering}
        />
        <div
          ref={targetRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="overflow-hidden bg-white flex justify-center items-center"
        >
          <div
            className="text-black text-center max-w-full max-h-full outline-0"
            onBlur={(e) => {
              handleTextEdit({
                pageNum,
                blockNum,
                val: e.currentTarget.innerText,
              });
            }}
            onClick={(e) => {
              e.currentTarget.focus();
            }}
            contentEditable={true}
            suppressContentEditableWarning={true}
            style={{
              fontSize: `${fontSize}px`,
              writingMode: block.vertical
                ? ("vertical-rl" as const)
                : ("unset" as const),
            }}
          >
            {block.lines[0]}
          </div>
        </div>
      </div>
      <Moveable
        hideDefaultLines={!hovering}
        origin={false}
        ref={moveableRef}
        target={targetRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        resizable={true}
        keepRatio={false}
        throttleResize={1}
        renderDirections={
          hovering ? ["nw", "n", "ne", "w", "e", "sw", "s", "se"] : []
        }
        onDragEnd={(e) => {
          if (e.target.parentElement) {
            const transform = shiftTransformToParent(e);

            handleBoxDragResize({
              pageNum,
              blockNum,
              transform,
              width,
              height,
            });
          }
        }}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        onResizeEnd={(e) => {
          const { width: newWidthPx, height: newHeightPx } = e.target.style;
          const newWidth = parseFloat(newWidthPx);
          const newHeight = parseFloat(newHeightPx);
          if (e.target.parentElement) {
            e.target.parentElement.style.width = `${newWidth + PADDING * 2}px`;
            e.target.parentElement.style.height = `${
              newHeight + PADDING * 2
            }px`;

            const transform = shiftTransformToParent(e);

            handleBoxDragResize({
              pageNum,
              blockNum,
              transform,
              width: newWidth,
              height: newHeight,
            });
          }
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
      />
    </div>
  );
}
