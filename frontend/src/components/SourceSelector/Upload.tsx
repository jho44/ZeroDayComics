import { ChangeEvent, useState } from "react";
import { useSource } from "../../contexts/Source";
import { socket } from "../../socket";
import styles from "./SourceSelector.module.css";

type FilesObj = { [key: string]: File };

// https://levelup.gitconnected.com/how-to-implement-multiple-file-uploads-in-react-4cdcaadd0f6e
export default function Upload() {
  /* Hooks */
  const { handleOcrStartUI, handlePageDoneUI, handleAllPagesDoneUI } =
    useSource();

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
    socket.emit("files_uploaded", actualFiles);
  };

  return (
    <div className={`${styles.upload} flex flex-col items-center gap-6`}>
      <label htmlFor="fileUpload" className="w-full">
        <div className="border-2 border-dashed border-sky-500 cursor-pointer w-full max-w-[700px] flex justify-center items-center h-[200px] rounded-2xl">
          Click to upload manga image files
        </div>
      </label>
      <input
        className="hidden"
        id="fileUpload"
        type="file"
        multiple
        accept="images/*"
        onChange={handleFileEvent}
      />

      <table className="border-separate border-spacing-x-4 border-spacing-y-3">
        <tbody className="max-h-[100px] block overflow-scroll">
          {Object.keys(files).map((fname) => (
            <tr key={fname} className="gap-4">
              <td className="">{fname} </td>
              <td>
                <button
                  onClick={() => {
                    setFiles((_files) => {
                      const newFiles = { ..._files };
                      delete newFiles[fname];
                      return newFiles;
                    });
                  }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id={styles["upload-submit-btn"]} onClick={handleUpload}>
        Submit
      </button>
    </div>
  );
}
