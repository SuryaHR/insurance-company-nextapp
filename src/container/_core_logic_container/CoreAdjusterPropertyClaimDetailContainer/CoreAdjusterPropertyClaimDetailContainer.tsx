"use client";
import CustomLoader from "@/components/common/CustomLoader/index";
import CoreAdjusterPropertyClaimDetailComponent from "@/components/_core_logic_components/CoreAdjusterPropertyClaimDetailComponentCoreAdjusterPropertyClaimDetailComponent/CoreAdjusterPropertyClaimDetailComponent";
import { useEffect, useState } from "react";
import { addSessionData } from "@/reducers/Session/SessionSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { authenticate } from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";

interface propsTypes {
  claimNumberEncrypted: string;
}
const CoreAdjusterPropertyClaimDetailContainer: React.FC<propsTypes> = ({
  claimNumberEncrypted,
}) => {
  const [loginUser, setLoginUser] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let payload;

    // const content = "6mAQMYytNQONxCU1qaG+u3RtVKOcWzl+pO1ix5QGULQ=";
    const content = decodeURIComponent(claimNumberEncrypted);

    if (content) {
      payload = {
        ssoAccessToken: content,
      };
    }
    authenticate(payload).then((loginRes: any) => {
      if (loginRes.result.status === 200001 && loginRes.result?.data) {
        if (loginRes.result?.data?.token) {
          const claimId = loginRes.result.data.claimsOnHand[0].id;
          const claimNumber = loginRes.result.data.claimsOnHand[0].claimNumber;
          const token = loginRes.result?.data?.token;
          dispatch(
            addSessionData({
              claimId: claimId,
              claimNumber: claimNumber,
              claimNumberEncrypted: content,
              token: token,
              CRN: loginRes.result?.data?.companyDetails?.crn,
              companyId: loginRes.result?.data?.companyDetails?.id,
              userId: loginRes.result?.data?.userId,
            })
          );
          setLoginUser(loginRes.result);
        } else {
          setLoginUser(null);
        }
      }
    });
  }, [dispatch, claimNumberEncrypted]);

  if (loginUser) {
    return (
      <>
        {loginUser?.data ? (
          <CoreAdjusterPropertyClaimDetailComponent
            claimId={loginUser?.data.claimsOnHand[0].id}
          />
        ) : (
          <div className="container d-flex align-items-center justify-content-center pt-5 mt-5">
            Cannot access this page. Try Reload!
          </div>
        )}
      </>
    );
  } else {
    return <CustomLoader />;
  }
};
export default CoreAdjusterPropertyClaimDetailContainer;
