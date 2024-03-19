import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import TabsStyle from "./AlertTabsButton.module.scss";
import MessageAlertCardsComponent from "@/components/_adjuster_components/AlertComponent/MessageAlertCardsComponent";
import DashboardNotification from "@/components/_adjuster_components/AlertComponent/DashboardNotification";

const AlertTabsButton = async (props: any) => {
  const { translate } = props;
  const tabData = [
    {
      name: translate?.adjusterDashboardTranslate?.adjusterDashboard?.AlterTabsButton
        ?.Notifications,
      content: <DashboardNotification translate={translate} />,
      className: TabsStyle.tab1,
    },
    {
      name: translate?.adjusterDashboardTranslate?.adjusterDashboard?.AlterTabsButton
        ?.Messages,
      content: <MessageAlertCardsComponent translate={translate} />,
      className: TabsStyle.tab2,
    },
  ];
  return <TabsButtonComponent tabData={tabData} showBorders={true} />;
};

export default AlertTabsButton;
