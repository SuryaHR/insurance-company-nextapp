import React from "react";
import Modal from "@/components/common/ModalPopups";
import ContentListComponentStyle from "../../ContentListComponent.module.scss";
import { RootState } from "@/store/store";
import { connect } from "react-redux";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import GenericButton from "@/components/common/GenericButton";
import { parseFloatWithFixedDecimal } from "@/utils/utitlity";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { ITEM_STATUS } from "@/constants/constants";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import { CalculateRCV } from "@/utils/calculateRCV";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import {
  getClaimSettlement,
  updateCliamStatus,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";

function AcceptMinValueModal(props: any) {
  const { isOpen, onClose, handleLoader, claimContentListDataFull, claimId, token } =
    props;

  const minimumThreshold = props?.claimDetail?.minimumThreshold;
  let totalAmountToPrice = 0;
  const selectedItems: any = [];
  claimContentListDataFull.forEach((item: any) => {
    if (
      item.totalStatedAmount != 0 &&
      item.totalStatedAmount <= minimumThreshold &&
      item?.statusName === "CREATED"
    ) {
      totalAmountToPrice += item.totalStatedAmount;
      selectedItems.push(item);
    }
  });

  const handleAcceptMinValues = async () => {
    handleLoader();
    if (selectedItems && selectedItems.length > 0) {
      const selectedItemsList =
        selectedItems &&
        selectedItems.map((item: any) => {
          const ItemDetails = { ...item };
          if (!item?.category?.name) {
            const othersCategory = props.category.find(
              (item: any) => item.categoryName === "Others"
            );
            ItemDetails.category = {
              id: othersCategory.categoryId,
              name: othersCategory.categoryName,
            };
            if (!item?.subCategory?.name) {
              const othersSubCategory = props.subCategory.find(
                (item: any) => item.name === "Others"
              );
              ItemDetails.subCategory = othersSubCategory;
            }
          }
          ItemDetails.adjusterDescription = item.description;
          const taxRate = item.taxRate && item.applyTax === true ? item.taxRate : 0;

          if (taxRate > 0) {
            ItemDetails.rcv = parseFloatWithFixedDecimal(
              ((item.totalStatedAmount / item.quantity) * 100) / (taxRate + 100)
            );
          } else {
            ItemDetails.rcv = parseFloatWithFixedDecimal(
              item.totalStatedAmount / item.quantity
            );
          }
          ItemDetails.replacedItemPrice = ItemDetails.rcv;
          ItemDetails.rcvTotal = ItemDetails.totalStatedAmount;
          ItemDetails.replacementQty = ItemDetails.quantity ?? 1;
          ItemDetails.replaced = true;
          CalculateRCV(ItemDetails, props.subCategory);
          return ItemDetails;
        });
      const param = {
        itemStatus: ITEM_STATUS.valued,
        claimItems: selectedItemsList,
      };
      onClose();
      const result = await updateCliamStatus(param, token);
      handleLoader();
      if (result?.status === 200) {
        await getClaimSettlement(claimId, token);
        const claimContentListRes = await claimContentList({ claimId }, true);
        if (claimContentListRes) {
          props.addClaimContentListData({
            claimContentData: claimContentListRes,
            claimId,
          });
          props.addNotification({
            message:
              "<" +
              selectedItemsList.length +
              "> items have been valued at their original cost for a total of <" +
              totalAmountToPrice.toFixed(2) +
              ">",
            id: "add_acceptMinVal_success",
            status: "success",
          });
        }
      } else {
        onClose();
        handleLoader();
        props.addNotification({
          message: result.errorMessage,
          id: "add_acceptMinVal_error",
          status: "error",
        });
      }
    } else {
      onClose();
      handleLoader();
      props.addNotification({
        message: `There are no items which are less then minimum $${minimumThreshold} to price`,
        id: "add_acceptMinVal_error",
        status: "error",
      });
    }
  };

  const FooterComp = () => {
    return (
      <div className={ContentListComponentStyle.modalWidth}>
        <div className="d-flex justify-content-end align-items-center">
          <GenericButton
            label="No"
            onClick={onClose}
            size="small"
            theme="linkBtn"
            btnClassname={`${ContentListComponentStyle.footBtn} me-3 `}
          />
          <GenericButton
            label="Yes"
            type="submit"
            onClick={() => handleAcceptMinValues()}
            size="small"
            btnClassname={ContentListComponentStyle.footBtn}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      headingName="Accept Min. Values"
      isOpen={isOpen}
      onClose={() => onClose()}
      modalWidthClassName={ContentListComponentStyle.modalContent}
      childComp={
        <div className={ContentListComponentStyle.addItemContainer}>
          <div className={ContentListComponentStyle.modalLabel}>
            A total of &lt;{selectedItems && selectedItems.length}&gt; items will be
            accepted at replacement cost of &lt;$
            {totalAmountToPrice.toFixed(2)}&gt;.Would you like to accept the original
            costs as replacement costs of these items?
          </div>
        </div>
      }
      footerContent={<FooterComp />}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  claimDetail: state?.claimDetail && state?.claimDetail?.contents,
  category: state?.commonData?.category || [],
  subCategory: state?.commonData?.subCategory || [],
  participants: state?.claimDetail?.participants || [],
  CRN: selectCRN(state),
  token: selectAccessToken(state),
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
  addMessageList,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AcceptMinValueModal);
