import React from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import styles from "./lineItemPagination.module.scss";
import clsx from "clsx";

interface propType {
  align?: "left" | "right";
  clickHandler: () => void;
}

function ArrowPageBtn(props: propType) {
  const { align = "left", clickHandler } = props;
  return (
    <div
      className={clsx(styles.arrowBtnContainer, {
        [styles[align]]: align,
      })}
      role="button"
      onClick={clickHandler}
    >
      {align === "left" && <FaCircleChevronLeft className={styles.arrowIcon} />}
      {align === "right" && <FaCircleChevronRight className={styles.arrowIcon} />}
    </div>
  );
}

export default ArrowPageBtn;
