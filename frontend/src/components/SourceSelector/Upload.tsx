import { ChangeEvent, useState } from "react";
import { arrayBufferToWebP } from "webp-converter-browser";
import { useSource } from "../../contexts/Source";
import styles from "./SourceSelector.module.css";

type FilesObj = { [key: string]: File };

// https://levelup.gitconnected.com/how-to-implement-multiple-file-uploads-in-react-4cdcaadd0f6e
export default function Upload() {
  /* Hooks */
  const { handleSubmitUI, handleResponse } = useSource();

  /* States */
  const [files, setFiles] = useState<FilesObj>({});

  /* Methods */
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
    if (!numFiles) return;

    handleSubmitUI({ numPages: numFiles });

    const formData = new FormData();
    await Promise.all(
      actualFiles.map(async (file) =>
        formData.append("files[]", await convertToWebp(file))
      )
    );

    fetch("http://localhost:4000/files_uploaded", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => await handleResponse(res))
      .catch((err) => console.error(err));
  };

  const convertToWebp = async (file: File) => {
    const res = await arrayBufferToWebP(await file.arrayBuffer());
    return res;
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
            <tr key={fname}>
              <td>{fname}</td>
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
