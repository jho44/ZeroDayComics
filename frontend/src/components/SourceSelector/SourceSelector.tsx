import SourceTable from "./SourceTable";
import Upload from "./Upload";

export default function SourceSelector() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full text-center p-4">
      <h1>Scrape a chapter from one of our supported platforms</h1>
      <SourceTable />
      <h1>OR</h1>
      <Upload />
    </div>
  );
}
