import React from "react";
import EvolutionInsuranceComponent from "./EvolutionInsuranceComponent";

interface propType {
  editInfo: boolean;
  editInfoHandleClick: any;
}
const AdminInsuranceCompanyComponent: React.FC<propType> = ({
  editInfo,
  editInfoHandleClick,
}) => {
  return (
    <>
      <div className="row">
        <EvolutionInsuranceComponent
          editInfo={editInfo}
          editInfoHandleClick={editInfoHandleClick}
        />
      </div>
    </>
  );
};

export default AdminInsuranceCompanyComponent;
