export default function SourceBox({
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
}) {
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
}
