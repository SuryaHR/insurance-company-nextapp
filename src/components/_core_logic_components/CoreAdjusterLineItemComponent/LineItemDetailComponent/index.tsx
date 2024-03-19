import React from "react";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import LineItemDetailComponentForm from "./LineItemDetailComponent";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";

function LineItemDetailComponent() {
  const lineItem = useAppSelector(
    (state) => state[EnumStoreSlice.LINE_ITEM_DETAIL]?.lineItem
  );
  if (!lineItem) {
    return null;
  }
  return <LineItemDetailComponentForm />;
}

export default LineItemDetailComponent;
