import assignmentDetailsStyle from "../assignmentDetails.module.scss";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { connect } from "react-redux";
import { convertToCurrentTimezone } from "@/utils/helper";
import { RootState } from "@/store/store";
import graphColor from "@/scss/graphColor.module.scss";

Chart.register(...registerables);

const AssignmentLifeCycle = (props: any) => {
  const { vendorAssignmentStatusfetching, vendorAssignmentStatusData } = props;

  const dates = vendorAssignmentStatusData.map((item: any) =>
    convertToCurrentTimezone(item.date, "MM/DD/YYYY h:mm:ss A")
  );
  const uniqueData = vendorAssignmentStatusData.map((item: any) => item.userRole);
  const userRoles = uniqueData.filter(
    (value: any, index: any, array: any) => array.indexOf(value) === index
  );

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${userRoles[context.raw]} 
            ${vendorAssignmentStatusData[context.dataIndex]?.status}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          fontFamily: "Lato",
          fontColor: graphColor.graphWhite,
          fontSize: 14,
          minRotation: 10,
        },
      },
      y: {
        ticks: {
          callback: function (value: any) {
            return userRoles[value];
          },
        },
      },
    },
  };

  const recvData = {
    labels: dates,
    datasets: [
      {
        label: "Date",
        data: vendorAssignmentStatusData.map((item: any) =>
          userRoles.indexOf(item.userRole)
        ),
        borderColor: graphColor.lineGraphBlue,
        backgroundColor: graphColor.lineGraphBlue,
        pointBackgroundColor: graphColor.lineGraphGreen,
        pointRadius: 5,
      },
    ],
  };
  return (
    <div className={assignmentDetailsStyle.TabContent}>
      {!vendorAssignmentStatusfetching && (
        <Line
          data={recvData}
          options={options}
          className={assignmentDetailsStyle.LineChart}
        />
      )}
    </div>
  );
};
const mapStateToProps = (state: RootState) => ({
  vendorAssignmentStatusData: state.assignmentDetailsData?.vendorAssignmentStatusData,
  vendorAssignmentStatusfetching:
    state.assignmentDetailsData?.vendorAssignmentStatusfetching,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AssignmentLifeCycle);
