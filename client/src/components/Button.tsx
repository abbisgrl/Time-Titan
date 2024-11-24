import clsx from "clsx";
import React, { ReactElement } from "react";

const Button = ({
  icon,
  className,
  label,
  type,
  onClick = () => {},
}: {
  icon?: ReactElement | null;
  className?: string;
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      type={type || "button"}
      className={clsx("px-3 py-2 outline-none", className)}
      onClick={onClick}
    >
      <span>{label}</span>
      {icon && icon}
    </button>
  );
};

export default Button;
