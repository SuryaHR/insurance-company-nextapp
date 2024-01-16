import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
import { ToastPosition, TypeOptions } from "react-toastify";

export interface notificationType {
  message: string;
  id: string;
  status?: TypeOptions;
  position?: ToastPosition;
}
export type NotifyType = notificationType[];

const initVal: NotifyType = [];

const NotificationSlice = createSlice({
  initialState: initVal,
  name: "notify",
  reducers: {
    addNotification(state, action) {
      state = [action.payload];
      return state;
    },
    removeNotification(state, action) {
      return state.filter((data) => data?.id !== action.payload);
    },
    removeAllNotification() {
      return [];
    },
  },
});

export default NotificationSlice;

export const { addNotification, removeNotification, removeAllNotification } =
  NotificationSlice.actions;
