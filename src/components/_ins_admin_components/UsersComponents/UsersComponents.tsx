"use client";
import React, { useState } from "react";
import UsersDashboard from "./UsersDashboard";
import UsersForm from "./UsersForm";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";

function UsersComponents() {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddUserClick = () => setShowAddForm(true);
  const closeAddUserForm = () => setShowAddForm(false);

  const pathList = [
    {
      name: "Home",
      path: "#",
    },
    {
      name: "Users",
      path: "#",
      active: !showAddForm,
      clickHandler: () => setShowAddForm(false),
    },
    {
      name: "New User",
      path: "#",
      optional: showAddForm,
      active: showAddForm,
    },
  ];

  return (
    <>
      <GenericBreadcrumb dataList={pathList} />
      {!showAddForm && <UsersDashboard onAddNewUser={handleAddUserClick} />}
      {showAddForm && <UsersForm handleClose={closeAddUserForm} />}
    </>
  );
}

export default UsersComponents;
