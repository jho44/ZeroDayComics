const fs = require("fs");

// async function saveUrlToFile(url, pageNum) {
//   try {
//     const response = await fetch(url);
//     const buffer = await response.blob();
//     fs.writeFileSync(`/tmp/${pageNum}`, buffer);
//     console.log("File saved successfully!");
//   } catch (error) {
//     console.error("Error saving file:", error);
//   }
// }

(async () => {
  const url =
    "blob:https://comic.pixiv.net/64155e13-eb22-4a57-83bf-8a10305af6fb";
  const pageNum = 1;
  try {
    const response = await fetch(url);
    const buffer = await response.blob();
    fs.writeFileSync(`./tmp/${pageNum}`, buffer);
    console.log("File saved successfully!");
  } catch (error) {
    console.error("Error saving file:", error);
  }
})();
