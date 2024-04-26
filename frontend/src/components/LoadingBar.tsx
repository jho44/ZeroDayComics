import { Fragment } from "react";

type Props = {
  numDone: number;
  numToDo: number;
};
export default function LoadingBar({ numDone, numToDo }: Props) {
  return (
    <Fragment>
      <div className="w-full max-w-[200px] h-3 bg-white rounded-sm overflow-hidden">
        <div
          className="bg-slate-400 h-full border-[3px] border-white"
          style={{ width: `${(numDone / numToDo) * 100}%` }}
        />
      </div>
      <p>
        {numDone} / {numToDo}
      </p>
    </Fragment>
  );
}
