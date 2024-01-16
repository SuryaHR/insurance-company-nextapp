"use client";
import React, { useState } from "react";
import Modal from "@/components/common/ModalPopups";
import { ConnectedProps, connect } from "react-redux";
import clsx from "clsx";
import { updateCliamCategoryFun } from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import changeCategoryStyle from "./changeCategoryStyle.module.scss";
import GenericInput from "../common/GenericInput";
import { claimContentList } from "@/services/ClaimContentListService";
import { useParams } from "next/navigation";
import { addClaimContentListData } from "@/reducers/ClaimData/ClaimContentSlice";

interface typeProps {
  [key: string | number]: any;
}

const ChangeCategoryModal: React.FC<connectorType & typeProps> = (props: any) => {
  const { isModalOpen, closeModal, category, claimContentListDataFull } = props;
  const [categotyFilter, setCategoryFilter] = useState("");

  const { claimId }: { claimId: string } = useParams();

  const updateClaimCategoty = async (data: any) => {
    const selectedClaims =
      claimContentListDataFull &&
      claimContentListDataFull.length > 0 &&
      claimContentListDataFull.filter((item: any) => item.selected === true);
    const selectedClaimsIds =
      selectedClaims && selectedClaims.map((item: any) => +item.itemId);

    const payload = {
      itemIds: selectedClaimsIds,
      categoryId: parseInt(data),
    };

    const updateItemRes = await updateCliamCategoryFun(payload);
    if (updateItemRes?.status === 200) {
      const claimData = { claimId };
      const claimContentListRes = await claimContentList(claimData, true);

      if (claimContentListRes) {
        props.addClaimContentListData({ claimContentData: claimContentListRes, claimId });

        props.addNotification({
          message: "Category Updated Successfully",
          id: "update_category_change_success",
          status: "success",
        });
        closeModal();
      }
    } else {
      props.addNotification({
        message: "Something went wrong.",
        id: "update_category_change_failure",
        status: "error",
      });
    }
  };

  const modalData =
    (category &&
      category?.length > 0 &&
      category
        .filter((item: any) =>
          item.categoryName.toLowerCase().includes(categotyFilter.toLowerCase())
        )
        .map((item: any) => {
          return { label: item?.categoryName, value: item?.categoryId };
        })) ||
    [];

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      overlayClassName={changeCategoryStyle.modalContainer}
      modalWidthClassName={changeCategoryStyle.modalContent}
      childComp={
        <div className={changeCategoryStyle.addItemContainer}>
          <div className={clsx("col-12 pb-3")}>
            <GenericInput
              placeholder="Search...."
              id="Search"
              type="text"
              value={categotyFilter}
              onChange={(event: any) => setCategoryFilter(event.target.value)}
            />
          </div>
          {modalData &&
            modalData.length > 0 &&
            modalData.map((item: any) => {
              return (
                <GenericInput
                  type="radio"
                  formControlClassname={changeCategoryStyle.formControl}
                  inputFieldWrapperClassName={changeCategoryStyle.wrapper}
                  inputFieldClassname={changeCategoryStyle.inputField}
                  value={item.value}
                  label={item.label}
                  id={item.label}
                  labelClassname={changeCategoryStyle.labelClassname}
                  onClick={(event: any) => {
                    updateClaimCategoty(event.target.value);
                  }}
                  key={item.label}
                />
              );
            })}
        </div>
      }
      headingName="Change Category"
    ></Modal>
  );
};

const mapStateToProps = ({ claimContentdata, claimDetail }: any) => ({
  category: claimDetail.category,
  claimDetail: claimDetail,
  claimContentdata: claimContentdata,
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ChangeCategoryModal);
