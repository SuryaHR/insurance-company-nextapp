import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyEmployees: [],
};

const UsersSlice = createSlice({
  initialState,
  name: "users",
  reducers: {
    addCompanyEmployees(state, action) {
      const { payload } = action;
      state.companyEmployees = payload;
    },
  },
});
export default UsersSlice;

export const { addCompanyEmployees } = UsersSlice.actions;
