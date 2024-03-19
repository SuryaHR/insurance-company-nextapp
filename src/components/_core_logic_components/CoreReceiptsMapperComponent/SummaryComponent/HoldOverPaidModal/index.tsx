import React from "react";
import Modal from "@/components/common/ModalPopups";
import receiptMapperStyle from "../../receiptMapperComponent.module.scss";
import { connect } from "react-redux";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, minLength, object, string } from "valibot";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { getUSDCurrency } from "@/utils/utitlity";
import { RootState } from "@/store/store";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import { getClaimedItems } from "@/services/_core_logic_services/CoreReceiptMapperService";
import { addClaimedItemsListData } from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import { updatePaidStatus } from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";

function HoldOverPaidModal(props: any) {
  const {
    isOpen,
    onClose,
    claimId,
    selectedClaimedItems,
    dueAmmount,
    setSelectedRows,
    setTableLoader,
    token,
    addClaimedItemsListData,
    userId,
  } = props;
  const FooterCompPaid = () => {
    return (
      <>
        <div className={receiptMapperStyle.modalWidth}>
          <div className="row m-1 flex-row-reverse">
            {dueAmmount > 0 && (
              <div className="col-4">
                <GenericButton label="Submit" type="submit" size="small" />
              </div>
            )}
            <div className="col-4">
              <GenericButton
                label={dueAmmount > 0 ? "Cancel" : "OK"}
                onClick={() => onClose()}
                size="small"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const onSubmit = async (data: Output<typeof schema>) => {
    onClose();
    setTableLoader(true);
    const claimItem: any = [];
    let newArr = {};
    selectedClaimedItems.map((item: any) => {
      if (
        item.status &&
        item.status.status &&
        (item.status.status == "REPLACED" || item.status.status == "PARTIAL REPLACED") &&
        item.selected
      ) {
        newArr = { isPaid: false };

        if (item.holdOverDue && item.holdOverDue > 0) {
          newArr = {
            ...item,
            ...newArr,
            holdOverPaymentPaidAmount: item.holdOverDue,
            holdOverDue: 0.0,
          };
        }

        claimItem.push(newArr);
      }
    });

    const payload = {
      ammount: dueAmmount,
      checkNumber: data?.checkNumber,
      claimLineItemDetails: claimItem,
      claimNumber: claimId && String(claimId),
      holdoverCheck: true,
      paidBy: userId ?? "",
      registrationNumber:
        process.env.NEXT_PUBLIC_JEWELRY_VENDOR ??
        process.env.NEXT_PUBLIC_SPEED_CHECK_VENDOR,
    };
    const updateStatusresult = await updatePaidStatus(payload, token);
    if (updateStatusresult?.status === 200) {
      const summaryList = await getClaimedItems(
        {
          claimId: claimId,
          reqForReceiptMapper: true,
        },
        token
      );
      if (summaryList === 200) {
        addClaimedItemsListData({ claimedData: summaryList });

        setSelectedRows({});
        props.addNotification({
          message: "Successfully submitted request",
          id: "mark_status_paid_success",
          status: "success",
        });
      }
    } else {
      props.addNotification({
        message: "Something went wrong.",
        id: "mark_status_paid_failure",
        status: "error",
      });
    }
    setTableLoader(false);
  };

  const schema = object({
    checkNumber: string([minLength(1, "Please Enter Check number")]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(schema);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        headingName="Holdover Details"
        isOpen={isOpen}
        onClose={() => onClose()}
        modalWidthClassName={receiptMapperStyle.modalPaidContent}
        childComp={
          <div className={receiptMapperStyle.addItemContainer}>
            <div className={receiptMapperStyle.modalLabel}>
              Paying a sum of Holdover for all items is {getUSDCurrency(dueAmmount)}
            </div>
            {dueAmmount <= 0 ? (
              <div className={`mt-3 ${receiptMapperStyle.modalLabel}`}>
                Cash Payout Exposure value should be greater than $0.00
              </div>
            ) : (
              <div>
                <GenericUseFormInput
                  formControlClassname={receiptMapperStyle.inputBox}
                  labelClassname={`mr-1 ${receiptMapperStyle.modalLabel}`}
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
  userId: selectLoggedInUserId(state),
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
  addMessageList,
  addClaimedItemsListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(HoldOverPaidModal);
