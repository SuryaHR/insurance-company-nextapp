import { createSlice } from "@reduxjs/toolkit";
import EnumStoreSlice from "../EnumStoreSlice";

type initialStateType = {
  [key: string]: any;
};
export const initialSessionState: initialStateType = {
  lang: "",
  name: "",
};

const SessionSlice = createSlice({
  initialState: initialSessionState,
  name: EnumStoreSlice.SESSION,
  reducers: {
    updateLoadingState(state, action) {
      const { payload } = action;
      state = { ...state, ...payload };
      return state;
    },
    addSessionData(state, action) {
      const { payload } = action;
      state = { ...state, ...payload };
      return state;
    },
    resetSessionState() {
      return initialSessionState;
    },
  },
});
export default SessionSlice;

export const { updateLoadingState, addSessionData, resetSessionState } =
  SessionSlice.actions;
