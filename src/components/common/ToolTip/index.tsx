import React, { useState } from "react";
import styles from "./Tooltip.module.scss";
import { FaInfoCircle } from "react-icons/fa";
import clsx from "clsx";

interface TooltipProps {
  text: any;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, className }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div className={clsx(styles.tooltipContainer, className)}>
      <div
        className={styles.tooltipTrigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FaInfoCircle className={styles.infoIcon} />
      </div>
      {isTooltipVisible && <div className={styles.tooltip}>{text}</div>}
    </div>
  );
};

export default Tooltip;
