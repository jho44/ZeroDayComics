"use client";
import { ReactNode, useReducer } from "react";
import ComicSourceContext from "./context";
import { Action, defaultVal, SourceInfo } from "./definitions";

function reducer(state: SourceInfo, action: Action) {
  switch (action.type) {
    case "init":
      const { type, ...payload } = action;
      return { ...state, ...payload };
    // case "add":
    //   newState.names.push(action.name);
    //   newState.phones.push(action.phone);
    //   newState.addrs.push(action.addr);
    //   return newState;
    default:
      throw new Error(
        "Invalid action type sent to ComicSourceProvider Reducer"
      );
  }
}

export default function ComicSourceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sourceInfo, setSourceInfo] = useReducer(reducer, defaultVal);

  return (
    <ComicSourceContext.Provider value={{ sourceInfo, setSourceInfo }}>
      {children}
    </ComicSourceContext.Provider>
  );
}
