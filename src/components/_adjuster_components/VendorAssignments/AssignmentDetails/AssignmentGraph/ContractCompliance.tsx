import assignmentDetailsStyle from "../assignmentDetails.module.scss";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { connect } from "react-redux";
import { RootState } from "@/store/store";
import graphColor from "@/scss/graphColor.module.scss";

Chart.register(...registerables);

const labels = ["First Touch", "Claim Resolution"];

const ContractCompliance = (props: any) => {
  const { vendorAssignmentGraphData } = props;

  const recvData = {
    labels: labels,
    datasets: [
      {
        id: 1,
        label: "Actual Time Taken",
        data: vendorAssignmentGraphData.actualTimes,
        backgroundColor: graphColor.barGraphBlue,
      },
      {
        id: 2,
        label: "Contracted Hours",
        data: vendorAssignmentGraphData.contractedHours,
        backgroundColor: graphColor.barGraphOrange,
      },
    ],
  };
  return (
    <div className={assignmentDetailsStyle.TabContent}>
      <Bar
        datasetIdKey="id"
        data={recvData}
        className={assignmentDetailsStyle.LineChart}
      />
    </div>
  );
};
const mapStateToProps = (state: RootState) => ({
  vendorAssignmentGraphData: state.assignmentDetailsData?.vendorAssignmentGraphData,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ContractCompliance);
