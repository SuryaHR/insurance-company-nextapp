import React from "react";
import MyTeamCardComponentStyle from "./MyTeamCardComponent.module.scss";
import profileImage from "@/assets/images/teamMemb.png";
import Image from "next/image";
import { CiLock } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { supervisorMyTeamPropType } from "@/app/[lang]/(claim_supervisor)/(dashboard)/supervisor-my-team/page";

interface type {
  myTeamDataValues: {
    openClaims: any;
    overdueClaims: any;
    totalSettlementAmount: any;
    details: any;
  };
}

const MyTeamCardComponent: React.FC<type> = ({ myTeamDataValues }) => {
  const { translate } =
    useContext<TranslateContextData<supervisorMyTeamPropType>>(TranslateContext);

  return (
    <>
      <div className={`${MyTeamCardComponentStyle.container}`}>
        <div className={`${MyTeamCardComponentStyle.upperSection} col-12`}>
          <div className={`${MyTeamCardComponentStyle.imageSection} col-3`}>
            <Image
              src={profileImage}
              alt="image"
              className={MyTeamCardComponentStyle.imageStyle}
            />
          </div>
          <div className={`${MyTeamCardComponentStyle.detailsSection} col-9`}>
            <div className="mt-3">
              <div className={`${MyTeamCardComponentStyle.labelContainer} col-12 my-1`}>
                <div className="col-8 text-right">
                  <label className={MyTeamCardComponentStyle.label}>
                    {translate?.supervisorMyTeamTranslate?.myTeam?.openClaims}
                  </label>
                </div>
                <div className={`${MyTeamCardComponentStyle.labelValue} col-4 mx-2`}>
                  {myTeamDataValues.openClaims}
                </div>
              </div>

              <div className={`${MyTeamCardComponentStyle.labelContainer} col-12 my-1`}>
                <div className="col-8 text-right">
                  <label className={MyTeamCardComponentStyle.label}>
                    {translate?.supervisorMyTeamTranslate?.myTeam?.overdueClaims}
                  </label>
                </div>
                <div className={`${MyTeamCardComponentStyle.labelValue} col-4 mx-2`}>
                  {myTeamDataValues.overdueClaims}
                </div>
              </div>

              <div className={`${MyTeamCardComponentStyle.labelContainer} col-12 my-1`}>
                <div className="col-8 text-right">
                  <label className={MyTeamCardComponentStyle.label}>
                    {translate?.supervisorMyTeamTranslate?.myTeam?.totalSettlement}
                  </label>
                </div>
                <div className={`${MyTeamCardComponentStyle.labelValue} col-4 mx-2`}>
                  {myTeamDataValues.totalSettlementAmount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className={`${MyTeamCardComponentStyle.lowerSection} col-12 px-3`}>
          <div className="col-6">
            <div className={`${MyTeamCardComponentStyle.detailsContainer} col-12`}>
              <div className="mt-1">
                <CiLock color={"#337ab7"} />
              </div>
              <div className="mx-1">
                <span className={MyTeamCardComponentStyle.spanText}>
                  {" "}
                  {myTeamDataValues?.details?.lastName +
                    ", " +
                    myTeamDataValues?.details?.firstName}
                </span>
              </div>
            </div>
            <div className={`${MyTeamCardComponentStyle.detailsContainer} col-12`}>
              <div className="mt-1">
                <FaPhoneAlt color={"#337ab7"} />
              </div>
              <div className="mx-1">
                <span className={MyTeamCardComponentStyle.spanText}>
                  {myTeamDataValues?.details?.cellPhone ||
                    myTeamDataValues?.details?.dayTimePhone}
                </span>
              </div>
            </div>
            <div className={`${MyTeamCardComponentStyle.detailsContainer} col-12`}>
              <div className="mt-1">
                <GoMail color={"#337ab7"} />
              </div>
              <div className="mx-1">
                <span className={MyTeamCardComponentStyle.spanText}>
                  {myTeamDataValues?.details?.email}
                </span>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className={`${MyTeamCardComponentStyle.labelContainer} col-12 my-1`}>
              <div className="col-6 text-right">
                <label className={MyTeamCardComponentStyle.label}>
                  {translate?.supervisorMyTeamTranslate?.myTeam?.designation}
                </label>
              </div>
              <div className={`${MyTeamCardComponentStyle.designationValue} col-6 mx-2`}>
                {myTeamDataValues?.details?.designation?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTeamCardComponent;
