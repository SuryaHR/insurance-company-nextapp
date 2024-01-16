import React from "react";
import addedComparablesStyle from "./addedComparables.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import ComparableItem from "./ComparableItem";
import { unknownObjectType } from "@/constants/customTypes";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";

function AddedComparables() {
  const comparable = useAppSelector(
    (state) => state[EnumStoreSlice.LINE_ITEM_DETAIL]?.comparableItems
  );
  return (
    <div className={addedComparablesStyle.root}>
      <div className={addedComparablesStyle.heading}>
        <GenericComponentHeading title="Added Comparable" />
      </div>
      <div className={addedComparablesStyle.content}>
        {comparable?.map((item: unknownObjectType) => (
          <ComparableItem key={item.id} data={item} />
        ))}
        {!comparable && (
          <div className="m-auto">
            <NoRecordComponent message="No comparable added yet" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddedComparables;
