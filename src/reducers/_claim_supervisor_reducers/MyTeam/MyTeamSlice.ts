import { unknownObjectType } from "@/constants/customTypes";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { createSlice } from "@reduxjs/toolkit";

export const initialMyTeamState: unknownObjectType = {
  myTeamData: [],
};

const MyTeamSlice = createSlice({
  initialState: initialMyTeamState,
  name: EnumStoreSlice.MY_TEAM,
  reducers: {
    addMyTeamData(state, action) {
      const { payload } = action;
      console.log(payload, "payload in reducer");

      state.myTeamData = payload;
      return state;
    },
  },
});
export default MyTeamSlice;

export const { addMyTeamData } = MyTeamSlice.actions;
