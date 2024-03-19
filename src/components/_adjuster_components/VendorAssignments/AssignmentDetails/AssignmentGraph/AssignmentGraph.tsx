import assignmentDetailsStyle from "../assignmentDetails.module.scss";
import TabsButtonComponent from "@/components/common/TabsButtonComponent/index";
import AssignmentLifeCycle from "./AssignmentLifeCycle";
import ContractCompliance from "./ContractCompliance";

const AssignmentGraph: React.FC = () => {
  const tabsArray = [
    {
      name: "Assignment Life Cycle",
      content: <AssignmentLifeCycle />,
    },
    {
      name: "Contract Compliance",
      content: <ContractCompliance />,
    },
  ];
  return (
    <>
      <div className={assignmentDetailsStyle.TabContainer}>
        <TabsButtonComponent tabData={tabsArray} />
      </div>
    </>
  );
};
export default AssignmentGraph;
