import React, { useState } from "react";
import GenericButton from "../GenericButton";
import LimitedWidthStyles from "./limitedWidthContent.module.scss";

const LimitedWidthContent = ({ text, limit = 50 }: { text: string; limit?: number }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };
  return (
    <div>
      {expanded ? (
        <div>
          {text}
          <span>
            <GenericButton
              label="Less"
              btnClassname={LimitedWidthStyles.linkStyle}
              theme="linkBtn"
              size="small"
              onClickHandler={toggleExpanded}
            />
          </span>
        </div>
      ) : (
        <div>
          {text && text.length > limit ? (
            <div>
              {text.slice(0, limit)}...
              <span>
                <GenericButton
                  label="More"
                  btnClassname={LimitedWidthStyles.linkStyle}
                  theme="linkBtn"
                  size="small"
                  onClickHandler={toggleExpanded}
                />
              </span>
            </div>
          ) : (
            <div>{text}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LimitedWidthContent;
