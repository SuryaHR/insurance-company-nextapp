import React from "react";
import ProgressBarStyle from "./ProgressBar.module.scss";

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progressBarStyle = {
    width: `${value}%`,
    backgroundColor: "#1fcf3d",
  };

  return (
    <div className={ProgressBarStyle.progressBarContainer}>
      <div className={ProgressBarStyle.progressBar} style={progressBarStyle}>
        {value > 0 && (
          <span className={ProgressBarStyle.progressText}>{`${value}%`}</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
