import { useViewer } from "../../contexts/Viewer";

const classNames =
  "bg-white absolute border border-red-700 text-black pointer-events-auto overflow-hidden resize-none";

const boxStyle = ({
  box,
  fontSize,
  boxNum,
  vertical,
}: {
  box: number[];
  fontSize: number;
  boxNum: number;
  vertical: boolean;
}) => ({
  width: `${box[2] - box[0]}px`,
  height: `${box[3] - box[1]}px`,
  left: `${box[0]}px`,
  top: `${box[1]}px`,
  fontSize: `${fontSize}px`,
  zIndex: boxNum,
  writingMode: vertical ? ("vertical-rl" as const) : ("unset" as const),
});

export const TranslatedBox = ({
  box,
  fontSize,
  vertical,
  boxNum,
  line,
  pageNum,
}: {
  box: number[];
  fontSize: number;
  vertical: boolean;
  boxNum: number;
  line: string;
  pageNum: number;
}) => {
  /* Contexts */
  const { handleTextEdit } = useViewer();

  return (
    <textarea
      onChange={(e) => {
        handleTextEdit({
          pageNum,
          blockNum: boxNum,
          val: e.currentTarget.value,
        });
      }}
      className={classNames}
      defaultValue={line}
      style={boxStyle({ box, fontSize, vertical, boxNum })}
    />
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
      className={classNames}
      style={boxStyle({
        box,
        fontSize,
        vertical,
        boxNum,
      })}
    >
      {lines.map((line, j) => (
        <p key={j}>{line}</p>
      ))}
    </div>
  );
};
