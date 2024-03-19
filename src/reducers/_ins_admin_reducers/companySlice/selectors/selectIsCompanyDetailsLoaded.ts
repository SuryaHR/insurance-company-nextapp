import { createSelector } from "@reduxjs/toolkit";
import selectCompanyDetails from "./selectCompanyDetails";

const selectIsCompanyDetailsLoaded = createSelector([selectCompanyDetails], (state) => {
  return state.isLoaded;
});

export default selectIsCompanyDetailsLoaded;
