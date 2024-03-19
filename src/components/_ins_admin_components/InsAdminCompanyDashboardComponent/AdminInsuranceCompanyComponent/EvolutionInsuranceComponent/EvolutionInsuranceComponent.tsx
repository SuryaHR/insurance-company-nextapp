"use client";
import EvolutionInsuranceComponentStyle from "./EvolutionInsuranceComponent.module.scss";
import Image from "next/image";
import GenericButton from "@/components/common/GenericButton";
import EditInformationComponent from "../EditInformationComponent/";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectAdminCompanyDetail from "@/reducers/_ins_admin_reducers/companySlice/selectors/selectAdminCompanyDetail";

interface propType {
  editInfo: boolean;
  editInfoHandleClick: any;
}

const EvolutionInsuranceComponent: React.FC<propType> = ({
  editInfo,
  editInfoHandleClick,
}) => {
  const companyDetails = useAppSelector(selectAdminCompanyDetail);

  return (
    <>
      {!editInfo && (
        <>
          <div className="col mt-4">
            <span className={EvolutionInsuranceComponentStyle.headingText}>
              Evolution Insurance Company
            </span>
            <hr />
          </div>
          <div className={EvolutionInsuranceComponentStyle.container}>
            <div className="col-md-3 col-sm-3 col-lg-2">
              <div className={EvolutionInsuranceComponentStyle.companyPageimageContainer}>
                <Image
                  className={EvolutionInsuranceComponentStyle.companyPageimage}
                  alt="company_logo"
                  fill
                  src={companyDetails?.companyLogo?.url}
                  sizes="100%"
                />
              </div>
              <div className="col-md-12 col-lg-12">
                <GenericButton
                  label="Edit Information"
                  theme="linkBtn"
                  onClick={editInfoHandleClick}
                />
              </div>
            </div>
            <div className="col-lg-7 col-sm-9 col-md-7 pt-3">
              <div
                className={`${EvolutionInsuranceComponentStyle.sectionRows} col-md-12 col-lg-12 col-sm-12`}
              >
                <div className="col-md-4 col-sm-6 col-lg-4 text-right">
                  <label className={EvolutionInsuranceComponentStyle.textStyle}>
                    {" "}
                    Company Id :
                  </label>
                </div>
                <div className="col-md-8 col-sm-6 col-lg-8 mx-4">
                  <label className={EvolutionInsuranceComponentStyle.textStyleValue}>
                    {companyDetails?.id}
                  </label>
                </div>
              </div>

              <div
                className={`${EvolutionInsuranceComponentStyle.sectionRows} col-md-12 col-lg-12 col-sm-12`}
              >
                <div className="col-md-4 col-sm-6 col-lg-4 text-right">
                  <label className={EvolutionInsuranceComponentStyle.textStyle}>
                    {" "}
                    Company Name :
                  </label>
                </div>
                <div className="col-md-8 col-sm-6 col-lg-8 mx-4">
                  <label className={EvolutionInsuranceComponentStyle.textStyleValue}>
                    {companyDetails?.companyName}
                  </label>
                </div>
              </div>

              <div
                className={`${EvolutionInsuranceComponentStyle.sectionRows} col-md-12 col-lg-12 col-sm-12`}
              >
                <div className="col-md-4 col-sm-6 col-lg-4 text-right">
                  <label className={EvolutionInsuranceComponentStyle.textStyle}>
                    {" "}
                    Company Website :
                  </label>
                </div>
                <div className="col-md-8 col-sm-6 col-lg-8 mx-4">
                  <label className={EvolutionInsuranceComponentStyle.textStyleValue}>
                    {companyDetails?.publicWebsite}
                  </label>
                </div>
              </div>

              <div
                className={`${EvolutionInsuranceComponentStyle.sectionRows} col-md-12 col-lg-12 col-sm-12`}
              >
                <div className="col-md-4 col-sm-6 col-lg-4 text-right">
                  <label className={EvolutionInsuranceComponentStyle.textStyle}>
                    Streamline Url :
                  </label>
                </div>
                <div className="col-md-8 col-sm-6 col-lg-8 mx-4">
                  <label className={EvolutionInsuranceComponentStyle.textStyleValue}>
                    {companyDetails?.companyWebsite}
                  </label>
                </div>
              </div>

              <div
                className={`${EvolutionInsuranceComponentStyle.sectionRows} col-md-12 col-lg-12 col-sm-12`}
              >
                <div className="col-md-4 col-sm-6 col-lg-4 text-right">
                  <label className={EvolutionInsuranceComponentStyle.textStyle}>
                    Company Administrator :
                  </label>
                </div>
                <div className="col-md-8 col-sm-6 col-lg-8 mx-4">
                  <label className={EvolutionInsuranceComponentStyle.textStyleValue}>
                    {`${companyDetails?.adminDetails.lastName}, ${companyDetails.adminDetails.firstName}`}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {editInfo && <EditInformationComponent />}
    </>
  );
};

export default EvolutionInsuranceComponent;
