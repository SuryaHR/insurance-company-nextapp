import React from "react";
import GenericButton from "@/components/common/GenericButton";
import { useRouter } from "next/navigation";
import NewClaimButtonStyle from "./NewClaimButton.module.scss";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { resetAddItemsTableData } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { setActiveSection } from "@/reducers/_adjuster_reducers/UploadCSV/navigationSlice";
interface NewClaimButtonProps {
  translate?: any;
}

const NewClaimButton: React.FC<NewClaimButtonProps> = ({ translate }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleNewClaimClick = () => {
    router.push("/new-claim");
    dispatch(setActiveSection(0));
    dispatch(resetAddItemsTableData());
  };
  return (
    <div className={NewClaimButtonStyle.newClaimButton}>
      <GenericButton
        label={
          translate?.adjusterDashboardTranslate?.adjusterDashboard
            ?.OpenClaimsTableComponent?.NewClaimButton.newCliam
        }
        theme="normal"
        size="small"
        type="submit"
        btnClassname={NewClaimButtonStyle.newClaimBtn}
        onClickHandler={handleNewClaimClick}
      />
    </div>
  );
};

export default NewClaimButton;
