"use client";

import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import rootReducer from "@/reducers";
import { Provider } from "react-redux";
import { addSessionData, updateLoadingState } from "@/reducers/Session/SessionSlice";
import {
  updateSearchText,
  updateSelectedProfile,
} from "@/reducers/_adjuster_reducers/GlobalSearch/GlobalSearchSlice";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export function StoreProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  if (typeof window !== "undefined") {
    const payload = Object.keys(localStorage).reduce((acc, cur) => {
      const data = localStorage.getItem(cur);
      return { ...acc, [cur]: data };
    }, {});
    const searchText = sessionStorage.getItem("searchString");
    const referer = sessionStorage.getItem("referer");
    const peopleDetail = sessionStorage.getItem("PeopleDetails");

    store.dispatch(updateSearchText({ searchString: searchText ?? "" }));
    store.dispatch(addSessionData({ ...payload, referer: referer ?? null }));

    if (peopleDetail) {
      store.dispatch(updateSelectedProfile(JSON.parse(peopleDetail)));
    }
    if (window.localStorage.getItem("lang") !== lang) {
      window.localStorage.setItem("lang", lang);
    }
  }
  store.dispatch(updateLoadingState({ lang: lang }));
  return <Provider store={store}>{children}</Provider>;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
