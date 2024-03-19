"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import CustomLoader from "@/components/common/CustomLoader";
import useDashboardAlert from "@/hooks/useDashboardAlert";
import AlertTableCards from "@/components/common/AlertCards/AlertTableCards";
import alertComponentStyle from "../alertComponent.module.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeAlertNotification } from "@/reducers/_adjuster_reducers/DashboardAlert/DashboardAlertSlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { deleteNotification } from "@/services/_adjuster_services/ClaimService";
import { useRouter } from "next/navigation";
import { gotoAlertDetails } from "../adjusterAlertRouteHelper";

function DashboardNotification(props: any) {
  const { translate } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loaded } = useDashboardAlert();
  const columns = ["Date", "Claim Details", "Message", ""];
  const notifications = useAppSelector((state) => state.alert.notifications);
  const handleDelete = (id: number) => {
    deleteNotification({ id, page: 1 })
      .then((res) => {
        const { data, message } = res;
        dispatch(removeAlertNotification({ id, data }));
        dispatch(
          addNotification({
            message:
              message ??
              translate?.adjusterDashboardTranslate?.adjusterDashboard?.AlterTabsButton
                ?.DashBoardNotification?.notificationDeleted,
            id,
            status: "success",
          })
        );
      })
      .catch((err) => {
        console.log("Delete notification error:", err);
        dispatch(
          addNotification({
            message:
              translate?.adjusterDashboardTranslate?.adjusterDashboard?.AlterTabsButton
                ?.DashBoardNotification?.somethingWentWrong,
            id,
            status: "error",
          })
        );
      });
  };

  const tableData = notifications.map((notification) => ({
    Date: notification?.createDate,
    Message: (
      <>
        <b>{notification?.notificationParams?.message1}</b>
        <br />
        {notification?.message}
      </>
    ),
    "Claim Details": (
      <>
        {notification?.insuredDetails?.firstName} {notification?.insuredDetails?.lastName}
        <br />
        {notification?.notificationParams?.claimNumber}
      </>
    ),
    "": (
      <div className={alertComponentStyle.deleteIconDiv}>
        <RiDeleteBin6Line
          onClick={() => handleDelete(notification?.id)}
          size="18"
          className={alertComponentStyle.deleteIcon}
        />
      </div>
    ),
    isRead: notification?.isRead,
    handleRowClick: () => {
      gotoAlertDetails(notification, router);
    },
  }));

  if (!loaded) {
    return (
      <div className={alertComponentStyle.container}>
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  return (
    <div className={alertComponentStyle.container}>
      <AlertTableCards columns={columns} tableData={tableData} />
    </div>
  );
}

export default DashboardNotification;
