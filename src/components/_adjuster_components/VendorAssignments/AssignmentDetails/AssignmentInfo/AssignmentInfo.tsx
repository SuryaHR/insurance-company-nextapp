"use client";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { connect } from "react-redux";

import assignmentDetailsStyle from "../assignmentDetails.module.scss";

import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { fetchVendorAssignmentRating } from "@/reducers/_adjuster_reducers/VendorAssignment/AssignmentDetailsSlice";

import Cards from "@/components/common/Cards/index";
import CustomLoader from "@/components/common/CustomLoader/index";
import GenericButton from "@/components/common/GenericButton/index";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import GenericSelect from "@/components/common/GenericSelect/index";
import Modal from "@/components/common/ModalPopups/index";
import StarRating from "@/components/common/StarRating/StarRating";
import { updateClaimDetail } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/ClaimSnapShotService";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";

import StarRatingHover from "./StarRatingHover";
import GenericTextArea from "@/components/common/GenericTextArea";

type labelProp = { label: string; value: any };

const CustomCard = ({ label, value }: labelProp) => (
  <Cards className={assignmentDetailsStyle.snapShotContentCard}>
    <div className={assignmentDetailsStyle.cardItemContainer}>
      <span className={assignmentDetailsStyle.numericContent}>{value}</span>
      <span className={assignmentDetailsStyle.numericContent}>{label}</span>
    </div>
  </Cards>
);

const CustomInfoText = ({ label, value }: labelProp) => (
  <>
    <label className={`col-md-3 col-sm-3 col-6 ${assignmentDetailsStyle.fieldLabel}`}>
      {label}
    </label>
    <div className="col-md-3 col-sm-3 col-6">{value}</div>
  </>
);

const dollarFormat = (value: number) => {
  return (
    <GenericNormalInput
      formControlClassname={assignmentDetailsStyle.formControl}
      inputFieldWrapperClassName={assignmentDetailsStyle.wrapper}
      inputFieldClassname={assignmentDetailsStyle.formInputControl}
      value={getUSDCurrency(+value ?? 0)}
      disabled={true}
    />
  );
};

const customGenericSelectStyle = {
  width: "150px",
};
const AssignmentInfo = (props: any) => {
  const {
    vendorAssignmentDetailsData,
    contentServicesData,
    fetchVendorAssignmentRating,
    vendorAssignmentRateFetching,
    vendorAssignmentItemsData,
    fetchDetails,
  } = props;

  const dateFormate = "MMM DD, YYYY h:mm A";
  const [serviceReq, setServiceReq] = useState(false);
  const [serviceReqContent, setServiceReqContent] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [ratingText, setRatingText] = useState<string>();
  const [newSum, setData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCheckValues, setSelectedCheckValues] = useState<any>();

  const ClaimProfile = process.env.NEXT_PUBLIC_CLAIM_PROFILE;

  const dispatch = useAppDispatch();

  const handleServiceReq = () => {
    setServiceReq(!serviceReq);
  };

  const handleServiceReqSuccess = async () => {
    const respecObj = contentServicesData.filter(
      (item: any) => item.service === serviceReqContent?.service
    );
    const subservice = respecObj[0]?.subServices?.filter((item: any) => {
      if (selectedCheckValues.includes(item.service)) return item;
    });
    const subCat = subservice.map((item: any) => ({
      id: item.id,
      name: item.service,
      selected: true,
    }));

    const obj = {
      id: serviceReqContent.id,
      name: serviceReqContent.service,
      subContentServices: subCat,
    };
    setIsLoading(true);
    const claimId = sessionStorage.getItem("claimId") || "";
    const claimNumber = sessionStorage.getItem("claimNumber") ?? "";
    const categories = [
      {
        categoryId: 22,
        categoryName: "Jewelry",
      },
    ];

    const requestedVendorService = obj;
    const payload = {
      claimId: claimId,
      oldClaimNumber: claimNumber,
      assignmentNumber: vendorAssignmentDetailsData.assignmentNumber,
      requestedVendorService: requestedVendorService,
      categories: categories,
      isUpdatedByInsuranceUser: true,
      isAssignmentUpdated: true,
    };

    const updateClaimDetailRes = await updateClaimDetail(payload);
    if (updateClaimDetailRes?.status === 200) {
      setIsLoading(false);
      dispatch(
        addNotification({
          message: updateClaimDetailRes?.message,
          id: "200",
          status: "success",
        })
      );
    } else {
      setIsLoading(false);
      dispatch(
        addNotification({
          message: updateClaimDetailRes?.errorMessage,
          id: "400",
          status: "error",
        })
      );
    }
    setServiceReq(!serviceReq);
    fetchDetails();
  };

  useEffect(() => {
    setServiceReqContent(vendorAssignmentDetailsData?.contentService);
    setRatingText(vendorAssignmentDetailsData?.assignmentComment ?? "");
    setRating(vendorAssignmentDetailsData.assignmentRating ?? 0);
  }, [vendorAssignmentDetailsData]);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleRating = (id: number) => {
    if (id == rating) {
      setRating(0);
    }
    setRating(id);
    setIsModalOpen(true);
  };
  const closeRatingModal = () => {
    setRatingText(vendorAssignmentDetailsData?.assignmentComment ?? "");
    if (vendorAssignmentDetailsData.assignmentRating) {
      setRating(vendorAssignmentDetailsData.assignmentRating);
    } else {
      setRating(0);
    }
    setIsModalOpen(false);
  };
  const submitRatingModal = async () => {
    const ratingData = await fetchVendorAssignmentRating({
      assignmentNumber: vendorAssignmentDetailsData.assignmentNumber,
      assignmentRating: rating,
      assignmentRatingComment: ratingText,
    });
    setIsModalOpen(false);
    if (ratingData) {
      dispatch(
        addNotification({
          message: ratingData.payload.message,
          id: ratingData.payload.status,
          status: "success",
        })
      );
    }
    fetchDetails();
  };

  const handleRatingText = (value: string) => {
    setRatingText(value);
  };

  const handleCategoryChange = (serviceObj: any) => {
    setServiceReqContent(serviceObj);
  };

  useEffect(() => {
    if (vendorAssignmentItemsData) {
      const initialValue = 0;
      const sum = vendorAssignmentItemsData.reduce(
        (accumulator: any, current: any) => accumulator + current.claimItem.rcvTotal,
        initialValue
      );
      setData(sum);
    }
  }, [vendorAssignmentItemsData]);

  const handleCheckChange = () => {
    const checkboxes: any = document.querySelectorAll(
      'input[name="subServices"]:checked'
    );
    const selectedValues = Array.from(checkboxes).map((checkbox: any) => checkbox.value);
    setSelectedCheckValues(selectedValues);
  };

  const EditServiceRequest = () => {
    const services = Array.from(contentServicesData);
    if (ClaimProfile == "Contents") {
      services.splice(
        services.findIndex((item: any) => item.service === "Salvage Only"),
        1
      );
    }
    const selectedServices: any = services.find(
      (item: any) => item.service === serviceReqContent?.service
    );
    return (
      <div className={assignmentDetailsStyle.grid}>
        <GenericSelect
          id="serviceRequest"
          value={serviceReqContent}
          getOptionLabel={(option: { service: any }) => option.service}
          getOptionValue={(option: { service: any }) => option.service}
          onChange={handleCategoryChange}
          options={services}
          customStyles={customGenericSelectStyle}
        />
        <div className="ml-3 flex">
          <FaCheck
            fill="green"
            className="mx-1 cursor-pointer"
            size={20}
            onClick={handleServiceReqSuccess}
          />
          <IoClose
            fill="red"
            className="mx-1 cursor-pointer"
            size={23}
            onClick={handleServiceReq}
          />
        </div>
        <div className="row gap-2">
          {selectedServices &&
            selectedServices?.subServices?.map((item: any) => (
              <div className="col-6" key={item.service}>
                <label
                  className={assignmentDetailsStyle.label}
                  htmlFor={item.service}
                  key={item.service}
                >
                  <input
                    className={assignmentDetailsStyle.inputCheckbox}
                    type="checkbox"
                    id={item.service}
                    name={"subServices"}
                    checked={selectedCheckValues?.includes(item.service) ?? false}
                    value={item.service}
                    onChange={handleCheckChange}
                  />
                  {item.service}
                </label>
              </div>
            ))}
        </div>
      </div>
    );
  };
  return (
    <>
      {isLoading && <CustomLoader />}
      <Cards
        className={`${assignmentDetailsStyle.snapShotcardContainer} ${assignmentDetailsStyle.infoCard}`}
      >
        <div className={assignmentDetailsStyle.contentContainer}>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            <CustomInfoText
              label="Status"
              value={vendorAssignmentDetailsData.status?.status}
            />
            <CustomInfoText
              label="Assignment Rating"
              value={
                <StarRatingHover
                  length={5}
                  existRating={rating}
                  handleClick={handleRating}
                />
              }
            />
          </div>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            <CustomInfoText
              label="Vendor Name"
              value={vendorAssignmentDetailsData.vendor?.vendorName}
            />
            <CustomInfoText
              label="Tax"
              value={
                vendorAssignmentDetailsData?.taxRate
                  ? `${vendorAssignmentDetailsData?.taxRate?.toFixed(2)}%`
                  : ""
              }
            />
          </div>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            <CustomInfoText
              label="Contracted Claim Time"
              value={`${vendorAssignmentDetailsData.maxClaimTime} days`}
            />
            <CustomInfoText
              label="Address"
              value={`
              ${vendorAssignmentDetailsData.vendor?.billingAddress?.streetAddressOne}, 
              ${vendorAssignmentDetailsData.vendor?.billingAddress?.streetAddressTwo}, 
              ${vendorAssignmentDetailsData.vendor?.billingAddress?.city}, 
              ${vendorAssignmentDetailsData.vendor?.billingAddress?.zipcode}`}
            />
          </div>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            <CustomInfoText
              label="Date Assigned"
              value={
                vendorAssignmentDetailsData?.startDate
                  ? convertToCurrentTimezone(
                      vendorAssignmentDetailsData?.startDate,
                      dateFormate
                    )
                  : ""
              }
            />
            <CustomInfoText
              label="End Date"
              value={
                vendorAssignmentDetailsData.endDate
                  ? convertToCurrentTimezone(
                      vendorAssignmentDetailsData?.endDate,
                      dateFormate
                    )
                  : ""
              }
            />
          </div>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            <CustomInfoText
              label="First Touch"
              value={
                vendorAssignmentDetailsData?.firstTouchTime
                  ? convertToCurrentTimezone(
                      vendorAssignmentDetailsData?.firstTouchTime,
                      dateFormate
                    )
                  : ""
              }
            />
            <CustomInfoText
              label="Time Elapsed"
              value={vendorAssignmentDetailsData.timeTakenFormatted}
            />
          </div>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            <label
              className={`col-md-3 col-sm-3 col-6 ps-1 ${assignmentDetailsStyle.fieldLabel}`}
            >
              Service Requested
            </label>
            {!serviceReq && vendorAssignmentDetailsData ? (
              <div>
                <b>{vendorAssignmentDetailsData.contentService?.service}</b>
                <FaPencil
                  className="mx-1 cursor-pointer"
                  size={14}
                  onClick={handleServiceReq}
                />
                <span>
                  {vendorAssignmentDetailsData.contentService?.subServices.length > 0 &&
                    "( "}
                  {vendorAssignmentDetailsData.contentService &&
                    vendorAssignmentDetailsData.contentService?.subServices?.map(
                      (item: any, key: number) => (
                        <span key={item.service}>
                          {item.service}
                          {key <
                            vendorAssignmentDetailsData.contentService?.subServices
                              .length -
                              1 && ","}
                        </span>
                      )
                    )}
                  {vendorAssignmentDetailsData.contentService?.subServices.length > 0 &&
                    " )"}
                </span>
              </div>
            ) : (
              <EditServiceRequest />
            )}
          </div>
          <div
            className={`col-md-12 col-sm-12 col-12 ${assignmentDetailsStyle.fieldRowContainer}`}
          >
            {serviceReqContent?.service === "Quote No Contact" && (
              <CustomInfoText label="Minimum Cost of Services" value={dollarFormat(0)} />
            )}
          </div>
          <div className={assignmentDetailsStyle.contentCardsContainer}>
            <div className="mt-2">
              <CustomCard
                label="#Items Assigned"
                value={vendorAssignmentDetailsData.numberOfItems}
              />
            </div>
            <div className="mt-2">
              <CustomCard
                label="#Items Processed"
                value={vendorAssignmentDetailsData.itemProcessed}
              />
            </div>
            <div className="mt-2">
              <CustomCard label="Total Quote" value={getUSDCurrency(+newSum ?? 0)} />
            </div>
            <div className="mt-2">
              <CustomCard
                label="Total Invoice"
                value={getUSDCurrency(+vendorAssignmentDetailsData?.invoiceTotal ?? 0)}
              />
            </div>
          </div>
        </div>
      </Cards>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={
          <div className={assignmentDetailsStyle.ratingModal}>
            <div>
              <StarRating rating={rating} showRatingNum={false} />
            </div>
            <GenericTextArea
              value={ratingText}
              onChange={(e: any) => {
                const value = e.target.value;
                handleRatingText(value);
              }}
              placeholder="Type here"
              rows={5}
            />
          </div>
        }
        footerContent={
          <div className={assignmentDetailsStyle.deleteModalBtn}>
            <GenericButton
              label="Cancel"
              theme="linkBtn"
              onClickHandler={closeRatingModal}
            />
            <GenericButton
              label="Submit"
              size="small"
              onClickHandler={submitRatingModal}
            />
          </div>
        }
        headingName={"Assignment Rating"}
        animate
        positionTop
        roundedBorder
      ></Modal>
      {vendorAssignmentRateFetching && <CustomLoader />}
    </>
  );
};

const mapStateToProps = ({ assignmentDetailsData }: any) => ({
  vendorAssignmentDetailsData: assignmentDetailsData.vendorAssignmentDetailsData,
  contentServicesData: assignmentDetailsData.contentServicesData,
  vendorAssignmentRateFetching: assignmentDetailsData.vendorAssignmentRateFetching,
  vendorAssignmentRating: assignmentDetailsData.vendorAssignmentRating,
  vendorAssignmentItemsData: assignmentDetailsData?.vendorAssignmentItemsData,
});

const mapDispatchToProps = {
  fetchVendorAssignmentRating,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AssignmentInfo);
