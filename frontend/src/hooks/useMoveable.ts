import { useRef } from "react";
import { Block } from "../lib/definitions";
import Moveable, {
  OnDrag,
  OnDragEnd,
  OnResize,
  OnResizeEnd,
} from "react-moveable";

const parseTransform = (transform: string | undefined) => {
  return (
    transform?.match(/-?\d+(\.\d+)?/g)?.map((x) => parseFloat(x)) ?? [0, 0]
  );
};

const shiftTransformToParent = (e: OnDragEnd | OnResizeEnd) => {
  const [pDx, pDy] = parseTransform(e.target.parentElement!.style.transform);
  const [cDx, cDy] = parseTransform(e.target.style.transform);

  const transform = `translate(${pDx + cDx}px, ${pDy + cDy}px)`;
  e.target.parentElement!.style.transform = transform;
  e.target.style.transform = "";
  return transform;
};

const useMoveable = ({
  block,
  pageNum,
  blockNum,
  handleBoxDragResize,
}: {
  block: Block;
  pageNum: number;
  blockNum: number;
  handleBoxDragResize: ({
    pageNum,
    blockNum,
    ...edits
  }: {
    pageNum: number;
    blockNum: number;
    transform: string;
    width: number;
    height: number;
  }) => void;
}) => {
  /* Constants */
  const PADDING = 10;

  /* Refs */
  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  /* Computed */
  const boxWidth = block.transform?.width ?? block.box[2] - block.box[0];
  const boxHeight = block.transform?.height ?? block.box[3] - block.box[1];

  /* Methods */
  const handleDragEnd = (e: OnDragEnd) => {
    if (e.target.parentElement) {
      const transform = shiftTransformToParent(e);

      handleBoxDragResize({
        pageNum,
        blockNum,
        transform,
        width: boxWidth,
        height: boxHeight,
      });
    }
  };

  const handleDrag = (e: OnDrag) => {
    e.target.style.transform = e.transform;
  };

  const handleResizeEnd = (e: OnResizeEnd) => {
    const { width: newWidthPx, height: newHeightPx } = e.target.style;
    const newWidth = parseFloat(newWidthPx);
    const newHeight = parseFloat(newHeightPx);
    if (e.target.parentElement) {
      e.target.parentElement.style.width = `${newWidth + PADDING * 2}px`;
      e.target.parentElement.style.height = `${newHeight + PADDING * 2}px`;

      const transform = shiftTransformToParent(e);

      handleBoxDragResize({
        pageNum,
        blockNum,
        transform,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleResize = (e: OnResize) => {
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
  };

  return {
    PADDING,
    targetRef,
    moveableRef,
    boxWidth,
    boxHeight,
    handleDragEnd,
    handleDrag,
    handleResizeEnd,
    handleResize,
  };
};

export default useMoveable;
