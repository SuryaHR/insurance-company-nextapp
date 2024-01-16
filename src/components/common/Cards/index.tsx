import React, { ReactNode, HTMLAttributes } from "react";
import cardDefaultStyle from "./Cards.module.scss";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  children?: ReactNode;
}

const Cards: React.FC<CardProps> = ({ width, height, children, className, ...rest }) => {
  const cardStyle = {
    width: width,
    height: height,
  };

  return (
    <div
      style={cardStyle}
      className={`${cardDefaultStyle.cardDefaultCSS} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Cards;
