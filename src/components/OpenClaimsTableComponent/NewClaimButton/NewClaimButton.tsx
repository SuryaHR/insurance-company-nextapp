import React from "react";
import GenericButton from "@/components/common/GenericButton";
import { useRouter } from "next/navigation";
import NewClaimButtonStyle from "./NewClaimButton.module.scss";

const NewClaimButton: React.FC = () => {
  const router = useRouter();
  return (
    <div className={NewClaimButtonStyle.newClaimButton}>
      <GenericButton
        label="New Claim"
        theme="normal"
        size="small"
        type="submit"
        btnClassname={NewClaimButtonStyle.newClaimBtn}
        onClickHandler={() => router.push("/new-claim")}
      />
    </div>
  );
};

export default NewClaimButton;
