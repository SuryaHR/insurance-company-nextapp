import React from "react";
import GenericButton from "@/components/common/GenericButton";
// import { useRouter } from "next/navigation";
import AllTaskButtonStyle from "./AllTaskButton.module.scss";

interface AllTaskButtonTypeProps {
  handleOpenModal: () => void;
}
const AllTaskButton: React.FC<AllTaskButtonTypeProps> = ({ handleOpenModal }) => {
  // const router = useRouter();
  return (
    <div className={AllTaskButtonStyle.AllTaskBtn}>
      <GenericButton
        label="Create Task"
        theme="normal"
        size="small"
        type="submit"
        btnClassname={AllTaskButtonStyle.AllTaskBtn}
        onClickHandler={handleOpenModal}
      />
    </div>
  );
};

export default AllTaskButton;
