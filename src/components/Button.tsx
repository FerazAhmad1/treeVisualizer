import React from "react";
interface ButtonProps {
  buttonName: string;
  buttonHandler: () => void;
  styleClass: string;
}
const Button: React.FC<ButtonProps> = ({
  buttonName,
  buttonHandler,
  styleClass,
}) => {
  return (
    <button onClick={() => buttonHandler()} className={styleClass}>
      {buttonName}
    </button>
  );
};

export default Button;
