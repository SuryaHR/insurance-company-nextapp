import React from "react";
import Modal from "@/components/common/ModalPopups";
import ContentListComponentStyle from "../ContentListComponent.module.scss";
import { connect } from "react-redux";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { updatePaidStatus } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, minLength, object, string } from "valibot";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import { getUSDCurrency } from "@/utils/utitlity";

function MarkAsPaidModal(props: any) {
  const {
    isOpen,
    onClose,
    handleLoader,
    claimId,
    userId,
    isValuedSelected,
    cashExposureTotalPrice,
  } = props;

  const schema = object({
    checkNumber: string([minLength(1, "Please Enter Check number")]),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useCustomForm(schema);

  const FooterCompPaid = () => {
    return (
      <>
        <div className={ContentListComponentStyle.modalWidth}>
          <div className="row m-1 flex-row-reverse">
            {cashExposureTotalPrice > 0 && (
              <div className="col-4">
                <GenericButton label="Submit" type="submit" size="small" />
              </div>
            )}
            <div className="col-4">
              <GenericButton
                label={cashExposureTotalPrice > 0 ? "Cancel" : "OK"}
                onClick={() => {
                  reset();
                  onClose();
                }}
                size="small"
                theme="linkBtn"
                btnClassname="p-1"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const onSubmit = async (data: Output<typeof schema>) => {
    reset();
    onClose();
    handleLoader();
    const payload = {
      ammount: cashExposureTotalPrice,
      checkNumber: data?.checkNumber,
      claimLineItemDetails:
        isValuedSelected &&
        isValuedSelected.map((item: any) => {
          return { ...item, isPaid: true };
        }),
      claimNumber: claimId && String(claimId),
      paidBy: userId && String(userId),
      registrationNumber:
        process.env.NEXT_PUBLIC_JEWELRY_VENDOR ??
        process.env.NEXT_PUBLIC_SPEED_CHECK_VENDOR,
    };
    const updateStatusresult = await updatePaidStatus(payload);
    if (updateStatusresult?.status === 200) {
      const claimContentListRes = await claimContentList({ claimId }, true);
      if (claimContentListRes) {
        handleLoader();
        props.addClaimContentListData({ claimContentData: claimContentListRes, claimId });
        props.addNotification({
          message: "Successfully submitted request",
          id: "mark_status_paid_success",
          status: "success",
        });
      }
    } else {
      handleLoader();
      props.addNotification({
        message: "Something went wrong.",
        id: "mark_status_paid_failure",
        status: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        headingName="Payment Details"
        isOpen={isOpen}
        onClose={() => {
          reset();
          onClose();
        }}
        modalWidthClassName={ContentListComponentStyle.modalPaidContent}
        childComp={
          <div className={ContentListComponentStyle.addItemContainer}>
            <div className={ContentListComponentStyle.modalLabel}>
              Paying a sum of {getUSDCurrency(cashExposureTotalPrice)} (Cash Payout
              Exposure) for {isValuedSelected && isValuedSelected.length} item
            </div>
            {cashExposureTotalPrice <= 0 ? (
              <div className={`mt-3 ${ContentListComponentStyle.modalLabel}`}>
                Cash Payout Exposure value should be greater than $0.00
              </div>
            ) : (
              <div className="d-flex align-items-center m-0 mt-2">
                <span className={`me-3 ${ContentListComponentStyle.modalLabel}`}>
                  Check #<span className="text-danger">*</span>
                </span>
                <GenericUseFormInput
                  formControlClassname={ContentListComponentStyle.inputBox}
                  labelClassname="d-none"
                  showError={errors["checkNumber"]}
                  errorMsg={errors?.checkNumber?.message}
                  // label="Check #*"
                  id="checkNumber"
                  autoComplete="off"
                  {...register("checkNumber")}
                />
              </div>
            )}
          </div>
        }
        footerContent={<FooterCompPaid />}
      ></Modal>
    </form>
  );
}

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
  addMessageList,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(MarkAsPaidModal);
