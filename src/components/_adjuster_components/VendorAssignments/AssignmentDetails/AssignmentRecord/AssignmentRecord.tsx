import assignmentDetailsStyle from "../assignmentDetails.module.scss";
import Cards from "@/components/common/Cards/index";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import { connect } from "react-redux";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";
import { CiCircleInfo } from "react-icons/ci";
import NoRecordComponent from "@/components/common/NoRecordComponent";

const AssignmentRecord = (props: any) => {
  const { vendorAssignmentDetailsData } = props;
  const dateFormate = "MMM DD, YYYY h:mm A";

  return (
    <>
      <Cards
        className={`${assignmentDetailsStyle.snapShotcardContainer} ${assignmentDetailsStyle.quote}`}
      >
        <Cards className={`${assignmentDetailsStyle.snapShotcardContainer}`}>
          <GenericComponentHeading title="Replacement Quote"></GenericComponentHeading>
          <div className="col-md-12">
            {vendorAssignmentDetailsData?.quoteNumbers &&
            vendorAssignmentDetailsData?.quoteNumbers?.length ? (
              vendorAssignmentDetailsData &&
              vendorAssignmentDetailsData?.quoteNumbers?.map((item: string) => (
                <a
                  key={item}
                  href="$"
                  ng-click="GoToViewQuote(AssginmentDetails.assignmentNumber,quoteNumber)"
                >
                  {item}
                </a>
              ))
            ) : (
              <NoRecordComponent message="No Records found" />
            )}
          </div>
        </Cards>
        <Cards className={assignmentDetailsStyle.snapShotcardContainer}>
          <GenericComponentHeading title="Vendor Invoices"></GenericComponentHeading>
          <div className="col-md-12">
            {vendorAssignmentDetailsData?.invoices &&
            vendorAssignmentDetailsData?.invoices?.length ? (
              vendorAssignmentDetailsData?.invoices?.map((invoice: any) => (
                <a
                  key={invoice.id}
                  href="$"
                  ng-click="GoToViewQuote(AssginmentDetails.assignmentNumber,invoices)"
                >
                  {`${getUSDCurrency(invoice.amount)} crated by ${
                    invoice.createdByContact.lastName
                  },${invoice.createdByContact.firstName} on ${convertToCurrentTimezone(
                    invoice.createDate,
                    dateFormate
                  )}`}
                </a>
              ))
            ) : (
              <NoRecordComponent message="No Records found" />
            )}
          </div>
        </Cards>
        <Cards className={assignmentDetailsStyle.snapShotcardContainer}>
          <GenericComponentHeading title="Vendor Team"></GenericComponentHeading>
          <div className="col-md-12">
            {vendorAssignmentDetailsData?.participants &&
            vendorAssignmentDetailsData?.participants?.length ? (
              vendorAssignmentDetailsData?.participants?.map((item: any) => (
                <div key={item?.lastName} className="d-flex align-items-center">
                  <span className={assignmentDetailsStyle.participantNameContainer}>
                    {`${item?.lastName}, ${item?.firstName} (${item?.roleName})`}
                  </span>
                  <CiCircleInfo size={18} />
                </div>
              ))
            ) : (
              <NoRecordComponent message="No Records found" />
            )}
          </div>
        </Cards>
      </Cards>
    </>
  );
};
const mapStateToProps = ({ assignmentDetailsData }: any) => ({
  vendorAssignmentDetailsData: assignmentDetailsData.vendorAssignmentDetailsData,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AssignmentRecord);
