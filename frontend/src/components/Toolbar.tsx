import { toPng } from "html-to-image";
import JSZip from "jszip";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type Props = {
  translated: boolean;
  setTranslated: Dispatch<SetStateAction<boolean>>;
  numPages: number;
  downloading: boolean;
  setDownloading: Dispatch<SetStateAction<boolean>>;
  numLoaded: number;
};

export default function Toolbar({
  translated,
  setTranslated,
  numPages,
  downloading,
  setDownloading,
  numLoaded,
}: Props) {
  /* Refs */
  const zip = useRef(new JSZip());

  /* Lifecycle Methods */
  useEffect(() => {
    if (numLoaded !== numPages) return;

    const createZipFolder = async () => {
      await Promise.all(
        Array(numPages)
          .fill(null)
          .map(async (_, pageNum) => {
            const imgData = await convertToPng(pageNum);
            if (!imgData) return null;
            zip.current.file(
              `${pageNum}.png`,
              imgData.replace(/^data:image\/?[A-z]*;base64,/, ""),
              { base64: true }
            );
          })
      );

      const zipData = await zip.current
        .generateAsync({
          type: "blob",
          streamFiles: true,
        })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (zipData) downloadZip(zipData);

      setDownloading(false);
    };

    createZipFolder();
  }, [numLoaded]);

  /* Methods */
  const downloadZip = (zipData: Blob) => {
    // Create a download link for the zip file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipData);
    link.download = "chapter.zip";
    link.addEventListener("click", () => {
      setTimeout(() => URL.revokeObjectURL(link.href), 30 * 1000);
    });
    link.click();
  };

  const convertToPng = (pageNum: number) => {
    const node = document.getElementById(`page-${pageNum}`);
    if (!node) return null;
    return toPng(node)
      .then((dataUrl) => dataUrl)
      .catch((error) => {
        console.error("Something went wrong with downloading to png", error);
        return null;
      });
  };

  const startDownload = () => {
    setDownloading(true);
  };

  return (
    <div className="z-[1] fixed opacity-0 hover:opacity-100 transition-all duration-150 top-0 w-screen flex items-center justify-center p-5 rounded-b-md bg-[#353b45] gap-4">
      <button onClick={() => setTranslated((prev) => !prev)}>
        {translated ? "Translated" : "Original"}
      </button>
      <button onClick={startDownload}>
        {downloading ? "Downloading..." : "Download to PNG"}
      </button>
    </div>
  );
}
