import { createSlice } from "@reduxjs/toolkit";
import {
  getClaimProfileList,
  getCompanyBackgroundImages,
  getInsuranceCompanyDetails,
  getStateList,
} from "./companyThunkService";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";

const initialState = {
  isLoaded: false,
  companyDetails: {},
  companyBackgroundImage: null,
  stateList: null,
  profileList: null,
};

const companySlice = createSlice({
  name: EnumStoreSlice.COMPANY_DETAIL,
  initialState,
  reducers: {
    updateCompanyState(state, action) {
      const { payload } = action;
      return { ...state, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInsuranceCompanyDetails.fulfilled, (state, action) => {
      state.companyDetails = action.payload.data;
    });
    builder.addCase(getCompanyBackgroundImages.fulfilled, (state, action) => {
      state.companyBackgroundImage = action.payload.data;
    });
    builder.addCase(getStateList.fulfilled, (state, action) => {
      state.stateList = action.payload.data;
    });
    builder.addCase(getClaimProfileList.fulfilled, (state, action) => {
      state.profileList = action.payload.data;
    });
  },
});

export const { updateCompanyState } = companySlice.actions;

export default companySlice;
