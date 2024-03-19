import { unknownObjectType } from "@/constants/customTypes";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { createSlice } from "@reduxjs/toolkit";

export const initialCommonDataState: unknownObjectType = {
  category: [],
  subCategory: [],
  pendingTaskList: [],
  messageList: [],
  participants: [],
  condition: [],
  retailer: [],
  room: [],
};

const CommonDataSlice = createSlice({
  initialState: initialCommonDataState,
  name: EnumStoreSlice.COMMON_DATA,
  reducers: {
    addCategories(state, action) {
      const { payload } = action;
      state.category = [...payload];
      return state;
    },
    addSubcategories(state, action) {
      const { payload } = action;
      state.subCategory = [...payload];
      return state;
    },
    addPendingTasks(state, action) {
      const { payload } = action;
      state.pendingTaskList = [...payload];
      return state;
    },
    addMessageList(state, action) {
      const { payload } = action;
      state.messageList = [...payload];
      return state;
    },
    addParticipants(state, action) {
      const { payload } = action;
      state.participants = [...payload];
      return state;
    },
    addCondition(state, action) {
      const { payload } = action;
      state.condition = [...payload];
      return state;
    },
    addRetailer(state, action) {
      const { payload } = action;
      state.retailer = [...payload];
      return state;
    },
    addRoom(state, action) {
      const { payload } = action;
      state.room = payload ? [...payload] : [];
      return state;
    },
  },
});
export default CommonDataSlice;

export const {
  addCategories,
  addSubcategories,
  addPendingTasks,
  addMessageList,
  addParticipants,
  addCondition,
  addRetailer,
  addRoom,
} = CommonDataSlice.actions;
