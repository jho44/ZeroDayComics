import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { socket } from "../../socket";
// import ComicSourceContext from "../contexts/ComicSource/context";

type FilesObj = { [key: string]: File };
type Props = {
  handleOcrStartUI: (_totalPages: number) => void;
  handlePageDoneUI: (page: { pageNum: number; blks: string }) => void;
  handleAllPagesDoneUI: () => void;
};

// https://levelup.gitconnected.com/how-to-implement-multiple-file-uploads-in-react-4cdcaadd0f6e
export default function Upload({
  handleOcrStartUI,
  handlePageDoneUI,
  handleAllPagesDoneUI,
}: Props) {
  /* Contexts */
  // const { setSourceInfo } = useContext(ComicSourceContext);

  /* States */
  const [files, setFiles] = useState<FilesObj>({});

  const handleFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    const newFiles: FilesObj = {};
    chosenFiles.forEach((f) => {
      if (files[f.name]) return;
      newFiles[f.name] = f;
    });
    setFiles((prev) => ({ ...prev, ...newFiles }));
  };

  const handleUpload = async () => {
    const actualFiles = Object.values(files);
    const numFiles = actualFiles.length;
    if (!numFiles) return; // TODO: UI Error

    handleOcrStartUI(numFiles);
    // // https://imagekit.io/blog/uploading-multiple-files-using-javascript/
    // const formData = new FormData();
    // actualFiles.forEach((f) => {
    //   formData.append("files[]", f);
    // });

    const onPageDone = (res: { pageNum: number; blks: string }) => {
      handlePageDoneUI(res);
    };

    const onAllPagesDone = () => {
      handleAllPagesDoneUI();
      socket.off("page_done", onPageDone);
      socket.off("all_pages_done", onAllPagesDone);
      socket.disconnect();
    };

    socket.connect();
    socket.on("page_done", onPageDone);
    socket.on("all_pages_done", onAllPagesDone);
    socket.emit(
      "files_uploaded",
      actualFiles.map((file) => [file.name, file])
    );

    // setSourceInfo({
    //   type: "init",
    //   totalPages: actualFiles.length,
    //   imgs: actualFiles,
    //   ocrPages: blks,
    // });
  };

  return (
    <div>
      <input
        id="fileUpload"
        type="file"
        multiple
        accept="images/*"
        onChange={handleFileEvent}
      />

      <button onClick={handleUpload}>Submit</button>

      <div>
        {Object.keys(files).map((fname) => (
          <div key={fname}>{fname}</div>
        ))}
        {
          // TODO: implement way to delete chosen files
        }
      </div>
    </div>
  );
}
