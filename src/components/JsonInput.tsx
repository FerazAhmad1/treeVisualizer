import { useState } from "react";
import type { JSONObject } from "../utils/types";
import Toast from "./Toast";
import { useCallback } from "react";
import { toast } from "react-toastify";
interface JsonInputProps {
  handleJsonInput: (value: JSONObject) => void;
}
const JsonInput: React.FC<JsonInputProps> = ({ handleJsonInput }) => {
  const [jsonObject, setJson] = useState("");
  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setJson(e.target.value);
  };
  const clickHandler = useCallback(() => {
    try {
      const value = JSON.parse(jsonObject);
      console.log(value, "DDDDDDDDDDDD");
      handleJsonInput(value);
    } catch (error) {
      toast.error("Invalid Json");
      console.log(error);
      return;
    }
  }, [jsonObject, handleJsonInput]);
  return (
    <>
      <div className="flex  flex-col w-[400px] ">
        <textarea
          onChange={changeHandler}
          className="block flex-1  bg-gray-100 w-[400px]  "
          value={jsonObject}
        />
        <button onClick={clickHandler} className="bg-blue-700 text-white p-2 ">
          Generate Tree
        </button>
      </div>
      <Toast />
    </>
  );
};

export default JsonInput;
