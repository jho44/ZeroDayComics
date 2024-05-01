import { useRef, useState } from "react";
import Moveable from "react-moveable";
import { useViewer } from "../../contexts/Viewer";
import { Block } from "../../lib/definitions";

const parseTransform = (transform: string | undefined) => {
  return (
    transform?.match(/-?\d+(\.\d+)?/g)?.map((x) => parseFloat(x)) ?? [0, 0]
  );
};
export const TranslatedBox = ({
  block,
  pageNum,
  blockNum,
}: {
  block: Block;
  pageNum: number;
  blockNum: number;
}) => {
  /* Contexts */
  const { handleBoxDragResize, handleTextEdit } = useViewer();

  /* States */
  const [hovering, setHovering] = useState(false);

  /* Refs */
  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  /* Computed */
  const width = block.transform?.width ?? block.box[2] - block.box[0];
  const height = block.transform?.height ?? block.box[3] - block.box[1];
  const PADDING = 10;

  return (
    <div className="pointer-events-auto">
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
          border: `${PADDING}px solid red`,
          // width: `${width}px`,
          // height: `${height}px`,
          // left: `${block.box[0]}px`,
          // top: `${block.box[1]}px`,
          // border: `${PADDING}px solid red`,
          // boxSizing: "border-box",

          zIndex: blockNum,
          transform: block.transform?.transform,
          background: "pink",
        }}
      >
        <div
          ref={targetRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: "blue",
          }}
          className="flex justify-center items-center pointer-events-auto"
        >
          <div className="max-w-full max-h-full ">Target</div>
        </div>
        {/* <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="overflow-hidden bg-white flex justify-center items-center"
        >
          <div
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
            className="text-black text-center max-w-full max-h-full outline-0"
            defaultValue={block.lines[0]}
            contentEditable={true}
            suppressContentEditableWarning={true}
        style={{
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: block.transform?.transform,
            style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: block.transform?.transform,
              fontSize: `${block.font_size}px`,
              writingMode: block.vertical
                ? ("vertical-rl" as const)
                : ("unset" as const),
            }}
          >
            {block.lines[0]}
          </div>
        </div> */}
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
            const [pDx, pDy] = parseTransform(
              e.target.parentElement.style.transform
            );
            const [cDx, cDy] = parseTransform(e.target.style.transform);

            const transform = `translate(${pDx + cDx}px, ${pDy + cDy}px)`;
            e.target.parentElement.style.transform = transform;
            e.target.style.transform = "";

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
          // const [dx, dy] = parseTransform(e.transform);
          // const [prevDx, prevDy] = parseTransform(
          //   e.target.parentElement?.style.transform
          // );
          // if (e.target.parentElement) {
          //   e.target.parentElement.style.transform = `translate(${
          //     prevDx + dx
          //   }px, ${prevDy + dy}px)`;
          // }

          // if (e.target.parentElement)
          //   e.target.parentElement.style.transform = e.transform;
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

            const [pDx, pDy] = parseTransform(
              e.target.parentElement.style.transform
            );
            const [cDx, cDy] = parseTransform(e.target.style.transform);

            const transform = `translate(${pDx + cDx}px, ${pDy + cDy}px)`;
            e.target.parentElement.style.transform = transform;
            e.target.style.transform = "";

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
};

export const SourceBox = ({
  box,
  fontSize,
  vertical,
  boxNum,
  lines,
}: {
  box: number[];
  fontSize: number;
  vertical: boolean;
  boxNum: number;
  lines: string[];
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        console.log("click handler");
      }}
      className="bg-white absolute border border-red-700 text-black pointer-events-auto overflow-hidden resize-none"
      style={{
        width: `${box[2] - box[0]}px`,
        height: `${box[3] - box[1]}px`,
        left: `${box[0]}px`,
        top: `${box[1]}px`,
        fontSize: `${fontSize}px`,
        zIndex: boxNum,
        writingMode: vertical ? ("vertical-rl" as const) : ("unset" as const),
      }}
    >
      {lines.map((line, j) => (
        <p key={j}>{line}</p>
      ))}
    </div>
  );
};
