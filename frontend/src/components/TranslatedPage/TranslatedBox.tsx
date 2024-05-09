import { useState } from "react";
import Moveable from "react-moveable";
import { useViewer } from "../../contexts/Viewer";
import useMoveable from "../../hooks/useMoveable";
import { Block, fontFamilies } from "../../lib/definitions";
import EditorToolbar from "./Toolbars/TranslBoxToolbar";

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
    handleFontFamChange: saveNewFontFam,
  } = useViewer();

  /* States */
  const [hovering, setHovering] = useState(false);
  const [fontSize, setFontSize] = useState(block.font_size);
  const [fontFam, setFontFam] = useState<string>(
    block.font_family ?? "hey-comic"
  );
  const [popperOpen, setPopperOpen] = useState(false);

  /* Hooks */
  const {
    PADDING,
    targetRef,
    moveableRef,
    boxWidth: width,
    boxHeight: height,
    handleDragEnd,
    handleDrag,
    handleResizeEnd,
    handleResize,
  } = useMoveable({ block, pageNum, blockNum, handleBoxDragResize });

  /* Computed */
  const hideMoveBox = popperOpen || !hovering;

  /* Methods */
  const handleFontSizeChange = (diff: number) => {
    setFontSize((_fontSize) => {
      const newFontSize = _fontSize + diff;
      if (newFontSize < 6 || newFontSize > 32) return _fontSize;

      saveNewFontSize({ blockNum, pageNum, newFontSize });
      return newFontSize;
    });
  };

  const handleFontFamChange = (newFontFam: string) => {
    setFontFam(newFontFam);
    saveNewFontFam({ blockNum, pageNum, newFontFam });
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
          pageNum={pageNum}
          blockNum={blockNum}
          fontFam={fontFam}
          handleFontSizeChange={handleFontSizeChange}
          handleFontFamChange={handleFontFamChange}
          hoveringOnTarget={hovering}
          setPopperOpen={setPopperOpen}
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
              // fontWeight: 700,
              // fontStyle: "italic",
              fontFamily: fontFamilies[fontFam].value,
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
        hideDefaultLines={hideMoveBox}
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
          hideMoveBox ? [] : ["nw", "n", "ne", "w", "e", "sw", "s", "se"]
        }
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        onResizeEnd={handleResizeEnd}
        onResize={handleResize}
      />
    </div>
  );
}
