import React from "react";
import GenericButton from "@/components/common/GenericButton";
interface AssignAddItemButtonProps {
  isAnyItemSelected: boolean;
  onClick: () => void;
}

const AssignAddItemButton: React.FC<AssignAddItemButtonProps> = ({
  isAnyItemSelected,
  onClick,
}) => {
  return (
    <>
      <GenericButton
        label="Assign Items"
        size="small"
        type="submit"
        disabled={isAnyItemSelected === undefined || !isAnyItemSelected}
        onClick={onClick}
      />
    </>
  );
};

export default AssignAddItemButton;
