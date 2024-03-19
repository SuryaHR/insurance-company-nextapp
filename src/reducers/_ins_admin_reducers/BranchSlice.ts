import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyEmployees: [],
  states: [],
  roles: [],
};

const BranchSlice = createSlice({
  initialState,
  name: "BranchSlice",
  reducers: {
    addCompanyEmployees(state, action) {
      const { payload } = action;
      state.companyEmployees = payload;
    },
    addStates(state, action) {
      const { payload } = action;
      state.states = payload;
    },
    addRoles(state, action) {
      const { payload } = action;
      state.roles = payload;
    },
  },
});
export default BranchSlice;

export const { addCompanyEmployees, addStates, addRoles } = BranchSlice.actions;
