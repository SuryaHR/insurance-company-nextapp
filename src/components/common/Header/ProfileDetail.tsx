import React, { useEffect, useState } from "react";
import NavStyle from "./headerStyle.module.scss";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectLoggedInUserName from "@/reducers/Session/Selectors/selectLoggedInUserName";

function ProfileDetail({ signoutHandle }: { signoutHandle: () => void }) {
  const name = useAppSelector(selectLoggedInUserName);
  const [firstName = "", lastName = ""] = name.split(",") ?? [];
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div className="d-flex align-items-center">
      <div className={NavStyle.userInfo}>
        {load && (
          <div className={NavStyle.userAvatar}>
            {`${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`}
          </div>
        )}
        {load && (
          <div className={NavStyle.userName}>
            {`${firstName.trim()} ${lastName.trim()}`}
          </div>
        )}
      </div>
      <div className={NavStyle.signoutText} onClick={signoutHandle}>
        Sign Out
      </div>
    </div>
  );
}

export default ProfileDetail;
