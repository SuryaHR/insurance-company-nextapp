import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import TabsStyle from "./AlertTabsButton.module.scss";
import { getServerCookie } from "@/utils/utitlity";
import MessageAlertCardsComponent from "@/components/AlertComponent/MessageAlertCardsComponent";
import DashboardNotification from "@/components/AlertComponent/DashboardNotification";
import { getNotification } from "@/services/ClaimService";

const AlertTabsButton = async () => {
  const id = await getServerCookie("userId");
  const data = await getNotification({ id, page: 1 });
  const tabData = [
    {
      name: "Notifications",
      content: <DashboardNotification data={data} />,
      className: TabsStyle.tab1,
    },
    {
      name: "Messages",
      content: <MessageAlertCardsComponent />,
      className: TabsStyle.tab2,
    },
  ];
  return <TabsButtonComponent tabData={tabData} showBorders={true} />;
};

export default AlertTabsButton;
