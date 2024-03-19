import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import {
  fetchAdminState,
  getAdminClaimProfile,
  getAdminCompanyBackgroundImages,
  getAdminCompanyDetails,
} from "@/services/_ins_admin_services/companyServices";
import { RootState } from "@/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getInsuranceCompanyDetails = createAsyncThunk(
  "ins_admin_company/fetchCompanyDetails",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    const state = api.getState() as RootState;
    try {
      const companyId = selectCompanyId(state);
      const res = await getAdminCompanyDetails(companyId);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCompanyBackgroundImages = createAsyncThunk(
  "ins_admin_company/fetchCompanyBackgroundImage",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getAdminCompanyBackgroundImages();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStateList = createAsyncThunk(
  "ins_admin_company/fetchStateList",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await fetchAdminState({
        isTaxRate: false,
        isTimeZone: false,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getClaimProfileList = createAsyncThunk(
  "ins_admin_company/fetchProfileList",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getAdminClaimProfile();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
