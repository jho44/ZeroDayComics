import { useRef, useState } from "react";
import Moveable from "react-moveable";
import { useViewer } from "../../contexts/Viewer";
import { Block } from "../../lib/definitions";

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
  const targetRef = useRef<HTMLTextAreaElement>(null);
  const moveableRef = useRef<Moveable>(null);

  /* Computed */
  const width = block.transform?.width ?? block.box[2] - block.box[0];
  const height = block.transform?.height ?? block.box[3] - block.box[1];
  const PADDING = 10;

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="absolute pointer-events-auto"
      style={{
        width: `${width + PADDING * 2}px`,
        height: `${height + PADDING * 2}px`,
        left: `${block.box[0] - PADDING}px`,
        top: `${block.box[1] - PADDING}px`,
        border: `${PADDING}px solid transparent`,
        zIndex: blockNum,
      }}
    >
      {/* TODO: replace with contenteditable div so can vertically center text */}
      <textarea
        ref={targetRef}
        onChange={(e) => {
          handleTextEdit({
            pageNum,
            blockNum,
            val: e.currentTarget.value,
          });
        }}
        onClick={(e) => {
          e.currentTarget.focus();
        }}
        className="bg-white text-black overflow-hidden resize-none text-center"
        defaultValue={block.lines[0]}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: block.transform?.transform,
          fontSize: `${block.font_size}px`,
          writingMode: block.vertical
            ? ("vertical-rl" as const)
            : ("unset" as const),
        }}
      />
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
        onDrag={(e) => {
          e.target.style.transform = e.transform;
          handleBoxDragResize({
            pageNum,
            blockNum,
            transform: e.transform,
            width: e.width,
            height: e.height,
          });
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
          handleBoxDragResize({
            pageNum,
            blockNum,
            transform: e.transform,
            width: e.width,
            height: e.height,
          });
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
