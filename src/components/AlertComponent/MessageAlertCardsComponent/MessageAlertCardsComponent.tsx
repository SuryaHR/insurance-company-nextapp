"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import AlertTableCards from "@/components/common/AlertCards/AlertTableCards";
import alertComponentStyle from "../alertComponent.module.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteNotification } from "@/services/ClaimService";
import { removeAlertMessage } from "@/reducers/DashboardAlert/DashboardAlertSlice";
import { addNotification } from "@/reducers/Notification/NotificationSlice";

const MessageAlertCardsComponent = () => {
  const dispatch = useAppDispatch();
  const columns = ["Date", "Claim Details", "Message", ""];
  const messages = useAppSelector((state) => state.alert.messages);
  const handleDelete = (id: number) => {
    deleteNotification({ id, page: 1 })
      .then((res) => {
        const { data, message } = res;
        dispatch(removeAlertMessage({ id, data }));
        dispatch(
          addNotification({
            message: message ?? "Notification Deleted.",
            id,
            status: "success",
          })
        );
      })
      .catch((err) => {
        console.log("Delete notification error:", err);
        dispatch(
          addNotification({
            message: "Something went wrong.",
            id,
            status: "error",
          })
        );
      });
  };
  const tableData = messages.map((message) => ({
    Date: message?.createDate,
    "Claim Details": (
      <>
        #{message?.notificationParams?.claimNumber}
        <br />
        {message?.insuredDetails?.firstName + ", " + message?.insuredDetails?.lastName}
      </>
    ),
    Message: (
      <>
        <b>
          New Message by {message?.sender?.lastName + ", " + message?.sender?.firstName}
        </b>
        <br />
        {message?.notificationParams?.message1 &&
          message?.notificationParams?.message1?.slice(0, 49) +
            (message?.notificationParams?.message1?.length > 50 ? "..." : "")}
      </>
    ),
    "": (
      <div className={alertComponentStyle.deleteIconDiv}>
        <RiDeleteBin6Line
          onClick={() => handleDelete(message?.id)}
          size="18"
          className={alertComponentStyle.deleteIcon}
        />
      </div>
    ),
    isRead: message?.isRead,
  }));

  return (
    <div className={alertComponentStyle.container}>
      <AlertTableCards tableData={tableData} columns={columns} />
    </div>
  );
};

export default MessageAlertCardsComponent;
