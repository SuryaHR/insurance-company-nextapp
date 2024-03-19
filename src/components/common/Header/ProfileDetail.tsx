import React, { useEffect, useState } from "react";
import NavStyle from "./headerStyle.module.scss";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectLoggedInUserName from "@/reducers/Session/Selectors/selectLoggedInUserName";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import Image from "next/image";
import selectLoggedInUserProfilePicture from "@/reducers/Session/Selectors/selectLoggedInUserProfilePicture";
import clsx from "clsx";

function ProfileDetail({ signoutHandle }: { signoutHandle: () => void }) {
  const name = useAppSelector(selectLoggedInUserName);
  const profilePicture = useAppSelector(selectLoggedInUserProfilePicture);
  const [firstName = "", lastName = ""] = name.split(",") ?? [];
  const [load, setLoad] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoad(true);
  }, []);

  const openModal = () => {
    router.push("/user-profile");
  };

  return (
    <div className="d-flex align-items-center">
      <div className={NavStyle.userInfo}>
        {load && (
          <Tooltip
            anchorSelect="#anchor-profile-click"
            place="bottom"
            hidden={false}
            openOnClick={false}
            clickable={true}
            className={NavStyle.customTooltip}
          >
            <div className={NavStyle.customTooltipContent}>
              <div
                className={`${NavStyle.dropDownInnerDiv} ${NavStyle.profileLink}`}
                onClick={openModal}
              >
                My profile
              </div>
              <div
                className={`${NavStyle.dropDownInnerDiv} ${NavStyle.profileLink}`}
                onClick={() => router.push("/reset-password")}
              >
                Security
              </div>
            </div>
          </Tooltip>
        )}
        <div id="anchor-profile-click" className={NavStyle.avtar}>
          {load && (
            <div
              className={clsx({
                [NavStyle.userAvatar]: true,
                [NavStyle.bgTransparant]:
                  profilePicture !== "undefined" && profilePicture,
              })}
            >
              {profilePicture !== "undefined" && profilePicture ? (
                <Image
                  src={profilePicture}
                  height={40}
                  width={40}
                  alt={"profile-picture"}
                />
              ) : (
                `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`
              )}
            </div>
          )}
          {load && <div className={NavStyle.userName}>{name}</div>}
        </div>
      </div>
      <div className={NavStyle.signoutText} onClick={signoutHandle}>
        Sign Out
      </div>
    </div>
  );
}

export default ProfileDetail;
