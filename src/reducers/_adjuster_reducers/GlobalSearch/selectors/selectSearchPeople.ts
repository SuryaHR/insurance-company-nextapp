import { createSelector } from "@reduxjs/toolkit";
import selectGlobalSearchState from "./selectGlobalSearchState";
import { unknownObjectType } from "@/constants/customTypes";

const getRoleString = (roleList: unknownObjectType[]) => {
  if (!roleList) {
    return "";
  }
  const roleString = roleList?.reduce((acc, role, i, arr) => {
    return (acc += `${role.roleName}${i < arr.length - 1 ? ", " : ""}`);
  }, "");
  return roleString;
};

export default createSelector([selectGlobalSearchState], (state) => {
  const data = [...(state.data.persons ?? [])]?.map((info) => ({
    ...info,
    roleText: getRoleString(info.roles),
  }));

  return data as unknownObjectType[];
});
