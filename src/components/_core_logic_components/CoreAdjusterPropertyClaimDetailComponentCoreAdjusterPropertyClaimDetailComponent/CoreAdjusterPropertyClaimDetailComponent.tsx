"use client";
import { Suspense, useEffect, useState } from "react";
import { ConnectedProps, connect, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "@/app/[lang]/loading";
import { useAppSelector } from "@/hooks/reduxCustomHook";

import CustomLoader from "@/components/common/CustomLoader/index";
import {
  claimContentList,
  getCategories,
  getClaimItemCondition,
  getClaimItemRetailers,
  getClaimItemRoom,
  getClaimRoomTypeData,
  getClaimSettlement,
  getSubCategories,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import CoreContentListComponent from "./CoreContentListComponent/CoreContentListComponent";
import { addRoomType } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import {
  addCategories,
  addCondition,
  addRetailer,
  addRoom,
  addSubcategories,
} from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";

type propsTypes = {
  claimId: string;
};

const CoreAdjusterPropertyClaimDetailComponent: React.FC<connectorType & propsTypes> = ({
  claimId,
  token,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const companyId = useAppSelector(selectCompanyId);
  useEffect(() => {
    const payload = {
      claimId: claimId,
    };

    const init = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getClaimSettlement(claimId, token),
          getCategories(token).then((categoryListRes) => {
            if (Array.isArray(categoryListRes?.data)) {
              dispatch(addCategories(categoryListRes?.data));
            }
          }),
          getSubCategories({ categoryId: null }, token).then((subcategoryListRes) => {
            if (Array.isArray(subcategoryListRes?.data)) {
              dispatch(addSubcategories(subcategoryListRes?.data));
            }
          }),
          claimContentList(payload, token).then((claimContentListRes) => {
            if (claimContentListRes?.data) {
              dispatch(
                addClaimContentListData({
                  claimContentData: claimContentListRes,
                  claimId,
                })
              );
            }
          }),

          getClaimItemCondition(token).then((claimContitionRes) => {
            dispatch(addCondition(claimContitionRes?.data));
          }),
          getClaimItemRetailers(token).then((claimRetailerRes) => {
            dispatch(addRetailer(claimRetailerRes?.data?.retailers));
          }),
          getClaimItemRoom(claimId, token).then((claimRoomRes) => {
            dispatch(addRoom(claimRoomRes?.data));
          }),
          getClaimRoomTypeData(token).then((claimRoomTypeRes) => {
            dispatch(addRoomType(claimRoomTypeRes));
          }),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [claimId, companyId, dispatch, token]);

  if (!isLoading) {
    return (
      <div className="row">
        <Suspense fallback={<Loading />}>
          <div className="pt-3">
            <CoreContentListComponent claimId={claimId} />
          </div>
        </Suspense>
      </div>
    );
  }
  return <CustomLoader />;
};

const mapStateToProps = (state: RootState) => ({
  token: selectAccessToken(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(CoreAdjusterPropertyClaimDetailComponent);
