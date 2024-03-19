"use client";
import React from "react";
import { useState } from "react";
import AdminInsuranceCompanyComponent from "@/components/_ins_admin_components/InsAdminCompanyDashboardComponent/AdminInsuranceCompanyComponent/AdminInsuranceCompanyComponent";
import InsAdminOfficeListComponent from "./InsAdminOfficeListComponent";
import style from "./InsAdminCompanyDashboardComponent.module.scss";
import useInitHook from "@/hooks/useInitHook";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import {
  getClaimProfileList,
  getCompanyBackgroundImages,
  getInsuranceCompanyDetails,
  getStateList,
} from "@/reducers/_ins_admin_reducers/companySlice/companyThunkService";
import { updateCompanyState } from "@/reducers/_ins_admin_reducers/companySlice/companySlice";
import selectIsCompanyDetailsLoaded from "@/reducers/_ins_admin_reducers/companySlice/selectors/selectIsCompanyDetailsLoaded";
import Loading from "@/app/[lang]/loading";

const InsAdminCompanyDashboardComponent = () => {
  const [editInfo, setEditInfo] = useState(false);
  const isLoaded = useAppSelector(selectIsCompanyDetailsLoaded);

  const editInfoHandleClick = () => {
    setEditInfo(true);
  };
  const dispatch = useAppDispatch();

  const initFetch = () => {
    Promise.all([
      dispatch(getInsuranceCompanyDetails()),
      dispatch(getCompanyBackgroundImages()),
      dispatch(getStateList()),
      dispatch(getClaimProfileList()),
    ])
      .then(() => {
        dispatch(updateCompanyState({ isLoaded: true }));
      })
      .catch((err) => {
        console.warn("companyError@", err);
        dispatch(updateCompanyState({ isLoaded: true }));
      });
  };

  useInitHook({ methods: initFetch });

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className={style.container}>
      <AdminInsuranceCompanyComponent
        editInfo={editInfo}
        editInfoHandleClick={editInfoHandleClick}
      />
      <InsAdminOfficeListComponent editInfo={editInfo} />
    </div>
  );
};

export default InsAdminCompanyDashboardComponent;
