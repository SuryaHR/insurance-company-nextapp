import React, { useState } from "react";
import Modal from "@/components/common/ModalPopups";
import style from "./styleCloseClaim.module.scss";
import { RootState } from "@/store/store";
import { connect } from "react-redux";
import GenericButton from "@/components/common/GenericButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import selectClaimNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimNumber";
import { updateClaimStatus } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import CustomLoader from "@/components/common/CustomLoader";
import ItemsList from "./ItemsList";
import { useRouter } from "next/navigation";
import InvoiceList from "./InvoiceList";

function CloseClaimModal(props: any) {
  const { showConfirmation, closeConfirmModal } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(false);
  const [pedningItemTableData, setPedningItemTableData] = useState([]);
  const [pedningInvoiceTableData, setPedningInvoiceTableData] = useState([]);

  const router = useRouter();

  const handleLoader = () => setShowLoader((prevState) => !prevState);
  const modalOpenCloseHandler = () => setIsOpen((preState: any) => !preState);

  const submitConfirmModal = async () => {
    closeConfirmModal();
    handleLoader();

    const param = {
      claimId: props.claimId,
      claimStatus: "Closed",
    };

    const response = await updateClaimStatus(param);
    handleLoader();
    if (response?.status === 200) {
      const data = response.data;
      if (!data.statusUpdated) {
        modalOpenCloseHandler();
        data.pendingItems &&
          data.pendingItems.length > 0 &&
          setPedningItemTableData(data.pendingItems);
        data.pendingInvoices &&
          data.pendingInvoices.length > 0 &&
          setPedningInvoiceTableData(data.pendingInvoices);
      } else {
        props.addNotification({
          message: `Claim # ${props.claimNumber} was closed successfully`,
          id: "close_claim_success",
          status: "success",
        });
        router.replace("/adjuster-dashboard");
      }
    } else {
      props.addNotification({
        message: response.errorMessage ?? "Something went wrong.",
        id: "res_error",
        status: "error",
      });
    }
  };

  const ModalFooterComp = () => {
    return (
      <div className="col-12">
        <div className="d-flex justify-content-end align-items-center">
          <GenericButton
            label="OK"
            type="submit"
            onClick={() => modalOpenCloseHandler()}
            size="small"
            btnClassname={style.footBtn}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {showLoader && <CustomLoader />}
      <ConfirmModal
        showConfirmation={showConfirmation}
        closeHandler={closeConfirmModal}
        submitBtnText="Yes"
        closeBtnText="No"
        childComp={`Are you sure you want to close the claim# ${props?.claimNumber} ? `}
        modalHeading="Close Claim"
        submitHandler={submitConfirmModal}
      />
      <Modal
        headingName="Need Attention!"
        isOpen={isOpen}
        onClose={() => modalOpenCloseHandler()}
        modalWidthClassName={style.modalContent}
        childComp={
          <div className={style.addItemContainer}>
            <div className={style.modalLabel}>
              {pedningItemTableData.length > 0 && (
                <ItemsList pedningItemTableData={pedningItemTableData} />
              )}
              {pedningInvoiceTableData.length > 0 && (
                <InvoiceList pedningInvoiceTableData={pedningInvoiceTableData} />
              )}
            </div>
          </div>
        }
        footerContent={<ModalFooterComp />}
      />
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  claimNumber: selectClaimNumber(state),
});
const mapDispatchToProps = {
  addNotification,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(CloseClaimModal);
