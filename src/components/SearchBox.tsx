import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useCallback } from "react";
interface SearcBoxInterFace {
  buttonClicHandler: (value: string) => void;
}
const SearchBox: React.FC<SearcBoxInterFace> = ({ buttonClicHandler }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchHandler = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [searchTerm]
  );
  return (
    <div className=" flex w-[80%] text-center ">
      <Input
        type="text"
        styleClass=" outline-none flex-1 border border-blue-700 rounded-md rounded-r-none px-2 py-1 border-r-0 "
        changeHandler={searchHandler}
        inputValue={searchTerm}
      />
      <Button
        buttonName={"search"}
        buttonHandler={() => {
          buttonClicHandler(searchTerm);
        }}
        styleClass={
          "bg-blue-700 text-white border-0 outline-0 text-center px-2 rounded-r-md "
        }
      />
    </div>
  );
};

export default SearchBox;
