"use client";
import React, { useState } from "react";
import Modal from "@/components/common/ModalPopups";
import { ConnectedProps, connect } from "react-redux";
import clsx from "clsx";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import changeCategoryStyle from "./changeCategoryStyle.module.scss";
import { useParams } from "next/navigation";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import {
  claimContentList,
  updateCliamCategoryFun,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";

interface typeProps {
  [key: string | number]: any;
}

const ChangeCategoryModal: React.FC<connectorType & typeProps> = (props: any) => {
  const {
    isModalOpen,
    closeModal,
    category,
    claimContentListDataFull,
    setShowLoader,
    token,
  } = props;
  const [categotyFilter, setCategoryFilter] = useState("");

  const { claimId }: { claimId: string } = useParams();

  const updateClaimCategoty = async (data: any) => {
    setShowLoader(true);
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
    closeModal();
    const updateItemRes = await updateCliamCategoryFun(payload, token);
    if (updateItemRes?.status === 200) {
      const claimData = { claimId };
      const claimContentListRes = await claimContentList(claimData, token);
      if (claimContentListRes) {
        setShowLoader(false);
        props.addClaimContentListData({ claimContentData: claimContentListRes, claimId });

        props.addNotification({
          message: "Successfully Updated Category",
          id: "update_category_change_success",
          status: "success",
        });
      }
    } else {
      props.addNotification({
        message: updateItemRes.errorMessage,
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
            <GenericNormalInput
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
                <GenericNormalInput
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

const mapStateToProps = (state: any) => ({
  category: state.commonData.category,
  token: selectAccessToken(state),
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ChangeCategoryModal);
