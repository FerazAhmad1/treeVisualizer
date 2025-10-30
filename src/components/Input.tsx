import React from "react";

interface InputProps {
  type: string;
  styleClass: string;
  inputValue: string;
  changeHandler: (value: string) => void;
}
const Input: React.FC<InputProps> = ({
  type,
  styleClass,
  inputValue,
  changeHandler,
}) => {
  const eventHandlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(e.target.value);
  };
  return (
    <input
      type={type}
      onChange={eventHandlerChange}
      value={inputValue}
      className={styleClass}
    />
  );
};

export default Input;
