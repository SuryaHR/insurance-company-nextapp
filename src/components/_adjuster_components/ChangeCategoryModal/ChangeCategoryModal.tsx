"use client";
import React, { useState } from "react";
import Modal from "@/components/common/ModalPopups";
import { ConnectedProps, connect } from "react-redux";
import clsx from "clsx";
import { updateCliamCategoryFun } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import changeCategoryStyle from "./changeCategoryStyle.module.scss";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import { useParams } from "next/navigation";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface typeProps {
  [key: string | number]: any;
}

const ChangeCategoryModal: React.FC<connectorType & typeProps> = (props: any) => {
  const { isModalOpen, closeModal, category, claimContentListDataFull, setShowLoader } =
    props;
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
    const updateItemRes = await updateCliamCategoryFun(payload);
    if (updateItemRes?.status === 200) {
      const claimData = { claimId };
      const claimContentListRes = await claimContentList(claimData, true);
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
      onClose={() => {
        setCategoryFilter("");
        closeModal();
      }}
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
                  formControlClassname={changeCategoryStyle.formControls}
                  inputFieldWrapperClassName={changeCategoryStyle.wrapper}
                  value={item.value}
                  label={item.label}
                  id={item.label}
                  labelClassname={changeCategoryStyle.labelClassname}
                  onClick={(event: any) => {
                    setCategoryFilter("");
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

const mapStateToProps = ({ claimContentdata, claimDetail, commonData }: any) => ({
  category: commonData.category,
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
