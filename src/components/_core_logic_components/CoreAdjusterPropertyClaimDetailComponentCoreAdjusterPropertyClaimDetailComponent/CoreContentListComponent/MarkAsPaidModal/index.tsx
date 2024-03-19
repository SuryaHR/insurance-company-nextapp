import React from "react";
import Modal from "@/components/common/ModalPopups";
import ContentListComponentStyle from "../../ContentListComponent.module.scss";
import { connect } from "react-redux";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, minLength, object, string } from "valibot";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import {
  claimContentList,
  updatePaidStatus,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import { RootState } from "@/store/store";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";

function MarkAsPaidModal(props: any) {
  const {
    isOpen,
    onClose,
    handleLoader,
    claimId,
    userId,
    isValuedSelected,
    cashExposureTotalPrice,
    token,
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
    const updateStatusresult = await updatePaidStatus(payload, token);
    if (updateStatusresult?.status === 200) {
      const claimContentListRes = await claimContentList({ claimId }, token);
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
              Paying a sum of ${cashExposureTotalPrice.toFixed(2)} (Cash Payout Exposure)
              for {isValuedSelected && isValuedSelected.length} item
            </div>
            {cashExposureTotalPrice <= 0 ? (
              <div className={`mt-3 ${ContentListComponentStyle.modalLabel}`}>
                Cash Payout Exposure value should be greater than $0.00
              </div>
            ) : (
              <div>
                <GenericUseFormInput
                  formControlClassname={ContentListComponentStyle.inputBox}
                  labelClassname={`mr-1 ${ContentListComponentStyle.modalLabel}`}
                  showError={errors["checkNumber"]}
                  errorMsg={errors?.checkNumber?.message}
                  label="Check #*"
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

const mapStateToProps = (state: RootState) => ({
  token: selectAccessToken(state),
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
  addMessageList,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(MarkAsPaidModal);
