import { useState } from "react";
import JsonInput from "./components/JsonInput";
import { TreeView } from "./components/TreeView";
import type { JSONObject } from "./utils/types";

function App() {
  const [jsonInput, setInput] = useState<JSONObject | null>(null);
  const handleJsonInput = (data: JSONObject) => {
    console.log("gggggg", data);
    setInput(data);
  };
  return (
    <>
      <div className="flex h-dvh gap-10 ">
        <JsonInput handleJsonInput={handleJsonInput} />
        <TreeView jsonInput={jsonInput} />
      </div>
    </>
  );
}

export default App;
