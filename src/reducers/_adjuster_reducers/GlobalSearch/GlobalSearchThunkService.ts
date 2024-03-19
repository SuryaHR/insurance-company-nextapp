import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateSearchText } from "./GlobalSearchSlice";
import { getGlobalSearchResult } from "@/services/_adjuster_services/globalSearchService";
import selectCompanyId from "../../Session/Selectors/selectCompanyId";
import { RootState } from "@/store/store";

interface payloadInterface {
  searchString: string;
  initSearch?: boolean;
  clbk?: () => void;
}

export let searchReqController: AbortController;
export const globalSearch = createAsyncThunk(
  "GlobalSearch/getSearch",
  async (payload: payloadInterface, api) => {
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    const state = api.getState() as RootState;
    try {
      if (searchReqController) {
        const reason = new DOMException("Duplicate Request", "AbortError");
        searchReqController?.abort(reason);
      }
      searchReqController = new AbortController();
      const { searchString, initSearch = false, clbk } = payload;
      if (!initSearch) {
        dispatch(updateSearchText({ searchString }));
      }
      const companyId = selectCompanyId(state);
      const res = await getGlobalSearchResult(
        {
          companyId,
          searchString,
        },
        searchReqController
      );
      if (res.status === 200) {
        clbk && clbk();
      }
      return res;
    } catch (err) {
      console.log("globalSearch_err", err);
      return rejectWithValue(err);
    }
  }
);
