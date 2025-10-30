import { useState } from "react";
import JsonInput from "./components/JsonInput";
import type { JSONObject } from "./utils/types";
import NodeAndSearch from "./components/NodeAndSearch";
import { useCallback } from "react";

function App() {
  const [jsonInput, setInput] = useState<JSONObject | null>(null);
  const handleJsonInput = useCallback(
    (data: JSONObject) => {
      setInput(data);
    },
    [jsonInput]
  );
  return (
    <>
      <div className="flex h-dvh gap-10 ">
        <JsonInput handleJsonInput={handleJsonInput} />
        <NodeAndSearch jsonInput={jsonInput} />
      </div>
    </>
  );
}

export default App;
