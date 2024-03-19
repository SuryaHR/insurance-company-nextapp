"use client";
import { useCallback, useEffect } from "react";
import { connect } from "react-redux";

import assignmentDetailsStyle from "./assignmentDetails.module.scss";

import {
  fetchContentServices,
  fetchVendorAssignmentDetails,
  fetchVendorAssignmentGraphItems,
  fetchVendorAssignmentStatusItems,
} from "@/reducers/_adjuster_reducers/VendorAssignment/AssignmentDetailsSlice";

import CustomLoader from "@/components/common/CustomLoader/index";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";

import AssignmentContentList from "./AssignmentContentList/AssignmentContentList";
import AssignmentGraph from "./AssignmentGraph/AssignmentGraph";
import AssignmentInfo from "./AssignmentInfo/AssignmentInfo";
import AssignmentRecord from "./AssignmentRecord/AssignmentRecord";

const AssignmentDetails = (props: any) => {
  const {
    fetchVendorAssignmentDetails,
    fetchVendorAssignmentGraphItems,
    fetchVendorAssignmentStatusItems,
    vendorAssignmentDetailsData,
    vendorAssignmentStatusfetching,
    fetchContentServices,
    assignmentId,
  } = props;

  const fetchDetails = useCallback(() => {
    fetchVendorAssignmentDetails({
      assignmentNumber: assignmentId,
    });
  }, [fetchVendorAssignmentDetails, assignmentId]);

  const fetchAll = useCallback(() => {
    fetchDetails();
    fetchVendorAssignmentStatusItems({
      assignmentNumber: assignmentId,
    });
    fetchVendorAssignmentGraphItems({
      assignmentNumber: assignmentId,
    });
    fetchContentServices();
  }, [
    fetchDetails,
    fetchVendorAssignmentStatusItems,
    fetchVendorAssignmentGraphItems,
    fetchContentServices,
    assignmentId,
  ]);

  useEffect(() => {
    fetchAll();
  }, [
    fetchVendorAssignmentDetails,
    fetchVendorAssignmentStatusItems,
    fetchVendorAssignmentGraphItems,
    fetchContentServices,
    fetchAll,
  ]);

  if (vendorAssignmentStatusfetching) {
    return (
      <div className="col-12 d-flex flex-column position-relative">
        <CustomLoader />
      </div>
    );
  }
  return (
    <div className="m-3">
      <GenericComponentHeading
        title={`Asssignment#  -  ${vendorAssignmentDetailsData.assignmentNumber}`}
      ></GenericComponentHeading>
      <div className={assignmentDetailsStyle.container}>
        <AssignmentInfo fetchDetails={fetchDetails} />
        <AssignmentRecord />
        <AssignmentGraph />
      </div>
      <div className="my-4">
        <AssignmentContentList assignmentId={assignmentId} />
      </div>
    </div>
  );
};

const mapStateToProps = ({ assignmentDetailsData }: any) => ({
  vendorAssignmentDetailsData: assignmentDetailsData.vendorAssignmentDetailsData,
  vendorAssignmentStatusfetching: assignmentDetailsData.vendorAssignmentStatusfetching,
});

const mapDispatchToProps = {
  fetchVendorAssignmentDetails,
  fetchVendorAssignmentGraphItems,
  fetchVendorAssignmentStatusItems,
  fetchContentServices,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AssignmentDetails);
