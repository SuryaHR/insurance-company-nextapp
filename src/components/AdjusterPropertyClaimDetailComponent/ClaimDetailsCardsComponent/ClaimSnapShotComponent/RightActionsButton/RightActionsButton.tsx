"use client";
import { useState } from "react";
import actionsBtnStyle from "./RightActionsButton.module.scss";

type actionsType = {
  setShowForm: any;
};

const RightActionsComponent: React.FC<actionsType> = (props: any) => {
  const [showActionBtn, setShowActionBtn] = useState(false);
  return (
    <div className={actionsBtnStyle.actionBtnContainer}>
      {!showActionBtn && (
        <div
          className={actionsBtnStyle.editActionBtn}
          onClick={() => {
            props.setShowForm(true);
            setShowActionBtn(true);
          }}
        >
          Edit
        </div>
      )}
      {showActionBtn && (
        <div className={actionsBtnStyle.actionBtns}>
          <span className={actionsBtnStyle.updateActionBtn}>Update</span>
          <span
            className={actionsBtnStyle.cancelActionBtn}
            onClick={() => {
              props.setShowForm(false);
              setShowActionBtn(false);
            }}
          >
            Cancel
          </span>
        </div>
      )}
    </div>
  );
};

export default RightActionsComponent;
