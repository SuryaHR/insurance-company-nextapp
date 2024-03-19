import React from "react";
import addedComparablesStyle from "./addedComparables.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import ComparableItem from "./ComparableItem";
import { unknownObjectType } from "@/constants/customTypes";
import selectActiveComparable from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectActiveComparable";

function AddedComparables() {
  const comparable = useAppSelector(selectActiveComparable);
  return (
    <div className={addedComparablesStyle.root}>
      <div className={addedComparablesStyle.heading}>
        <GenericComponentHeading title="Added Comparable" />
      </div>
      <div className={addedComparablesStyle.content}>
        {comparable?.map((item: unknownObjectType, index: number) => (
          <ComparableItem key={`${item.id}_${index}`} data={item} />
        ))}
        {(!comparable || comparable.length < 1) && (
          <div className="m-auto">
            <NoRecordComponent message="No comparable added yet" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddedComparables;
