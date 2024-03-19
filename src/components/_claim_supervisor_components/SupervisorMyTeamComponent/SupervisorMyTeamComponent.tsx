"use client";
import React, { useEffect } from "react";
import SupervisorMyTeamComponentStyle from "./SupervisorMyTeamComponent.module.scss";
import MyTeamCardComponent from "./MyTeamCardComponent/index";
import { getMyTeamData } from "@/services/_claim_supervisor_services/SupervisorMyTeamService";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { addMyTeamData } from "@/reducers/_claim_supervisor_reducers/MyTeam/MyTeamSlice";
import { supervisorMyTeamPropType } from "@/app/[lang]/(claim_supervisor)/(dashboard)/supervisor-my-team/page";

interface type {
  myTeamDataList: [];
}
const SupervisorMyTeamComponent: React.FC<type & connectorType> = ({
  myTeamDataList,
}) => {
  const { translate } =
    useContext<TranslateContextData<supervisorMyTeamPropType>>(TranslateContext);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myTeamData = await getMyTeamData();
        console.log(myTeamData, "myTeamData");

        if (myTeamData.status === 200) {
          dispatch(addMyTeamData(myTeamData?.data));
        } else {
          console.error("Error fetching  myTeamData:", myTeamData.statusText);
        }
      } catch (error) {
        console.error("Error fetching claim myTeamData:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <>
      <div className={SupervisorMyTeamComponentStyle.container}>
        <div className="col mx-4 mt-4">
          <span className={SupervisorMyTeamComponentStyle.headingText}>
            {translate?.supervisorMyTeamTranslate?.myTeam?.myTeamHeading} (
            {myTeamDataList?.length})
          </span>
          <hr />
        </div>
      </div>
      <div className={`${SupervisorMyTeamComponentStyle.cardContainer} col-12`}>
        {myTeamDataList?.map((item: any, index: any) => {
          return (
            <div key={index}>
              <MyTeamCardComponent myTeamDataValues={item} />
            </div>
          );
        })}
      </div>
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  myTeamDataList: state?.myTeam?.myTeamData,
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SupervisorMyTeamComponent);
