import { getNotification } from "@/services/ClaimService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { unknownObjectType } from "@/constants/customTypes";

interface notificationState {
  isLoaded: boolean;
  isFetching: boolean;
  isLastPage: boolean;
  notifications: unknownObjectType[];
  messages: unknownObjectType[];
  page: number;
  totalCount: number;
  totalPage: number;
}

const initialState = {
  isLoaded: false,
  isFetching: false,
  isLastPage: false,
  notifications: [],
  messages: [],
  page: 0,
  totalCount: 0,
  totalPage: 0,
} as notificationState;

export const fetchAlertNotification = createAsyncThunk(
  "alert/fetchNotification",
  async (_, api) => {
    const state = api.getState() as RootState;
    const rejectWithValue = api.rejectWithValue;
    try {
      const id = window?.localStorage?.getItem("userId");
      const curPage = state?.alert?.page;
      const response = await getNotification({ id, page: curPage + 1 }, true);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const DashboardAlertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert(state, action) {
      if (!state.isLoaded) {
        state.isLoaded = true;
        const {
          notifications,
          totalCount,
          page,
        }: { notifications: unknownObjectType[]; totalCount: number; page: number } =
          action.payload;
        if (!notifications) {
          return state;
        }
        for (const data of notifications) {
          if (data.notificationPurpose === "NOTE") {
            state.messages.push(data);
          } else {
            state.notifications.push(data);
          }
        }
        state.totalCount = totalCount;
        state.page = page;
        state.totalPage = Math.ceil(totalCount / 10);
      }
      return state;
    },
    updateAlert(state, action) {
      const { notifications, totalCount } = action.payload;
      for (const data of notifications) {
        if (data.notificationPurpose === "NOTE") {
          state.messages.push(data);
        } else {
          state.notifications.push(data);
        }
      }
      state.totalCount = totalCount;
      state.page += 1;
      state.totalPage = Math.ceil(totalCount / 10);
      state.isLastPage = state.page >= state.totalPage;
      state.isFetching = false;
    },
    removeAlertNotification(state, action) {
      const { id, data } = action.payload;
      if (data) {
        const totalCount = data?.totalClaims ?? state.totalCount - 1;
        state.totalCount = totalCount;
        state.totalPage = Math.ceil(totalCount / 10);
        if (state.page > state.totalPage) {
          state.page = state.totalPage;
        }
      }
      state.notifications = state.notifications.filter((data) => data?.id !== id);
      return state;
    },
    removeAlertMessage(state, action) {
      const { id } = action.payload;
      state.messages = state.messages.filter((data) => data?.id !== id);
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAlertNotification.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchAlertNotification.fulfilled, (state, action) => {
      DashboardAlertSlice.caseReducers.updateAlert(state, action);
    });
    builder.addCase(fetchAlertNotification.rejected, (state) => {
      state.isFetching = false;
      state.page += 1;
      state.isLastPage = state.page >= state.totalCount;
    });
  },
});

export const isFetchingSelector = (state: RootState) => state.alert.isFetching;
export const isLastPageSelector = (state: RootState) => state.alert.isLastPage;
export const { addAlert, removeAlertNotification, removeAlertMessage } =
  DashboardAlertSlice.actions;
export default DashboardAlertSlice;
