import { createSelector } from "@reduxjs/toolkit";
import selectCompanyDetails from "./selectCompanyDetails";
import { unknownObjectType } from "@/constants/customTypes";

const selectAdminCompanyDetail = createSelector([selectCompanyDetails], (state) => {
  return state.companyDetails as unknownObjectType;
});

export default selectAdminCompanyDetail;
