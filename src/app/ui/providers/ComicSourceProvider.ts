import { ReactNode, useRef, useState } from "react";
import { ComicSourceContext } from "../Contexts";

// type SourceInfo = {
//   comicUrl: string;
//   latestRetrievedPageNum: number;
//   totalPages: number;
// };

// type Action = {
//   type: "setComicUrl";
//   comicUrl: string;
// };

// function reducer(state: SourceInfo, action: Action) {
//   let newState = { ...state };
//   switch (action.type) {
//     // case "add":
//     //   newState.names.push(action.name);
//     //   newState.phones.push(action.phone);
//     //   newState.addrs.push(action.addr);
//     //   return newState;
//     default:
//       throw new Error(
//         "Invalid action type sent to ComicSourceProvider Reducer"
//       );
//   }
// }

export default function ComicSourceProvider({
  children,
}: {
  children: ReactNode;
}) {
  // const [sourceInfo, setSourceInfo] = useReducer(reducer, {
  //   comicUrl: "",
  //   latestRetrievedPageNum: 0,
  //   totalPages: 0,
  // });
  // setUsers({ type: "add", name: name, phone: phone, addr: addr });
  // const comicUrl = useRef("");
  // const latestRetrievedPageNum = useRef(0);
  // const totalPages = useRef(0);
  const [comicUrl, setComicUrl] = useState("");
  const [latestRetrievedPage, setLatestRetrievedPage] = useState(0);

  return (
    <ComicSourceContext.Provider
      value={{
        comicUrl,
        setComicUrl,
        latestRetrievedPage,
        setLatestRetrievedPage,
      }}
    >
      {children}
    </ComicSourceContext.Provider>
  );
}
