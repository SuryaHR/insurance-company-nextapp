"use client";
import Loading from "@/app/[lang]/loading";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectProfile from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectProfile";
import React, { useEffect, useState } from "react";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import ProfileDetailWrapper from "./ProfileDetailWrapper";
import styles from "./profileDetailWrapper.module.scss";

function PeopleDetailComponent() {
  const profileDetail = useAppSelector(selectProfile);
  const [loaded, setLoaded] = useState(false);

  const pathList = [
    {
      name: "Home",
      path: "/adjuster-dashboard",
    },
    {
      name: "Search Results",
      path: "/adjuster-global-search",
    },
    {
      name: profileDetail ? `${profileDetail?.firstName} ${profileDetail?.lastName}` : "",
      path: "#",
      active: true,
    },
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) {
    return <Loading />;
  }
  return (
    <div className={styles.root}>
      {!profileDetail && <Loading />}
      <GenericBreadcrumb dataList={pathList} />
      <ProfileDetailWrapper data={profileDetail ?? {}} />
    </div>
  );
}

export default PeopleDetailComponent;
