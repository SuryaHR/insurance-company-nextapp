import React from "react";
import GenericButton from "@/components/common/GenericButton";
import adssstyle from "./addItemsButton.module.scss";

const AddItemsButton: React.FC = () => {
  return (
    <>
      <GenericButton
        label="Add Item"
        size="small"
        type="submit"
        btnClassname={adssstyle.addBUTONStyle}
      />
    </>
  );
};

export default AddItemsButton;
