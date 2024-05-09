import { ReactNode } from "react";

export default function Button({
  children,
  onClick,
  isActive,
  popper,
}: {
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  popper?: ReactNode;
}) {
  return (
    <div className={`relative group ${isActive ? "is-active" : ""}`}>
      <button
        className="border-[1px] border-zinc-300 hover:bg-zinc-200 group-[.is-active]:bg-zinc-300 active:bg-zinc-300 rounded-md h-6 p-1.5 flex items-center justify-center text-nowrap"
        onClick={onClick}
        disabled={isActive}
      >
        {children}
      </button>
      {popper ? <div className="popper absolute">{popper}</div> : <></>}
    </div>
  );
}
