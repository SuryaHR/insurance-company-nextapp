import { createSlice } from "@reduxjs/toolkit";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { globalSearch } from "./GlobalSearchThunkService";
import { unknownObjectType } from "@/constants/customTypes";

export type searchDataType = {
  claims: null | unknownObjectType[];
  documents: null | unknownObjectType[];
  persons: null | unknownObjectType[];
  policies: null | unknownObjectType[];
  vendors: null | unknownObjectType[];
  invoices: null | unknownObjectType[];
};
export interface initialGlobalSearchStateType {
  searchString: null | string;
  isFetching: boolean;
  data: searchDataType;
  selectedProfile: unknownObjectType | null;
}
const initialState: initialGlobalSearchStateType = {
  searchString: null,
  isFetching: true,
  data: {
    claims: null,
    documents: null,
    persons: null,
    policies: null,
    vendors: null,
    invoices: null,
  },
  selectedProfile: null,
};

const GlobalSearchSlice = createSlice({
  name: EnumStoreSlice.GLOBAL_SEARCH,
  initialState,
  reducers: {
    updateSearchText(state, action) {
      const { searchString } = action.payload;
      state.searchString = searchString;
    },
    clearSearchText(state) {
      state.searchString;
    },
    resetGlobalSearch(state) {
      state.data = initialState.data;
    },
    updateGlobalSearch(state, action) {
      const { payload } = action;
      return { ...state, ...payload };
    },
    updateSelectedProfile(state, action) {
      state.selectedProfile = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(globalSearch.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(globalSearch.fulfilled, (state, action) => {
      state.isFetching = false;
      const { data } = action.payload;
      state.data = data;
    });
  },
});

export default GlobalSearchSlice;
export const {
  updateSearchText,
  clearSearchText,
  resetGlobalSearch,
  updateGlobalSearch,
  updateSelectedProfile,
} = GlobalSearchSlice.actions;
