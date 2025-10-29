import { useState } from "react";
import type { JSONObject } from "../utils/types";
interface JsonInputProps {
  handleJsonInput: (value: JSONObject) => void;
}
const JsonInput: React.FC<JsonInputProps> = ({ handleJsonInput }) => {
  const [jsonObject, setJson] = useState("");
  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setJson(e.target.value);
  };
  const clickHandler = () => {
    try {
      const value = JSON.parse(jsonObject);
      console.log(value, "DDDDDDDDDDDD");
      handleJsonInput(value);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col p-4">
      <textarea
        onChange={changeHandler}
        className="flex-1 block  bg-gray-300 w-[400px] h-[400px] "
        value={jsonObject}
      />
      <button onClick={clickHandler} className="bg-blue-700 text-white ">
        Generate Tree
      </button>
    </div>
  );
};

export default JsonInput;
