"use client";
import React, { useContext } from "react";
import { useState } from "react";
import ContentListTable from "./ContentListTable";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import ContentListComponentStyle from "../ContentListComponent.module.scss";
import GenericButton from "@/components/common/GenericButton/index";
import { connect } from "react-redux";
import {
  addClaimContentListData,
  addEditItemDetail,
  updateClaimContentListData,
} from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import ContentListSearchBox from "./ContentListSearchBox/ContentListSearchBox";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";

import clsx from "clsx";
import { RootState } from "@/store/store";
import CustomLoader from "@/components/common/CustomLoader";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
import { parseFloatWithFixedDecimal } from "@/utils/utitlity";
import {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setSelectedRows,
  setCategoryRows,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import AcceptMinValueModal from "./AcceptMinValueModal";
import MarkAsPaidModal from "./MarkAsPaidModal";
import { ITEM_STATUS } from "@/constants/constants";
import { CalculateRCV } from "@/utils/calculateRCV";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import OutsideClickHandler from "react-outside-click-handler";
import {
  claimContentList,
  getClaimSettlement,
  updateCliamStatus,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import { claimDetailTranslatePropType } from "@/app/[lang]/(core_logic)/(dashboardLayout)/core-logic/core-adjuster-property-claim-details/[claimNumberEncrypted]/page";
import AddItemModal from "./AddItemModal";
import ChangeCategoryModal from "./ChangeCategoryModal/ChangeCategoryModal";
import { addSessionData } from "@/reducers/Session/SessionSlice";

function CoreContentListComponent(props: any) {
  const {
    addClaimContentListData,
    claimId,
    editItemDetail,
    claimContentListData,
    claimContentListDataFull,
    categoryListRes,
    token,
    claimContentSearchKeyword,
    updateClaimContentListData,
    addSessionData,
    addEditItemDetail,
  } = props;
  const router = useRouter();
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = React.useState<React.SetStateAction<any>>(null);
  const [openMore, setOpenMore] = useState(false);
  const [isModalOpenAcceptMinVal, setIsModalOpenAcceptMinVal] = useState(false);
  const [isModalOpenPaid, setIsModalOpenPaid] = useState(false);
  const [checkedValues, setcheckStatus] = useState(false);
  const [getNumberSelected, setNumberSelected] = useState(0);
  const [openStatus, setOpenStatus] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpenChangeCat, setIsModalOpenChangeCat] = useState<boolean>(false);
  React.useEffect(() => {}, []);
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const getItems = async () => {
    setTableLoader(true);
    const claimContentListRes: any = await claimContentList(
      {
        claimId: claimId,
      },
      token
    );
    if (claimContentListRes) {
      addClaimContentListData({ claimContentData: claimContentListRes, claimId });
    }
    setTableLoader(false);
  };

  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const showDropDownMore = () => {
    setOpenMore(!openMore);
    setOpenStatus(false);
  };

  const openModal = () => {
    setEditItem(null);
    addEditItemDetail({ itemDetailData: {}, previousItem: false, nextItem: false });
    handleDropDown();
    setIsModalOpen(true);
  };

  const handleLoader = () => {
    setShowLoader((prevState) => !prevState);
  };
  const handleModalAccepetMinVal = () => {
    setIsModalOpenAcceptMinVal((prevState) => !prevState);
  };
  const handleModalPaid = () => {
    setIsModalOpenPaid((prevState) => !prevState);
  };

  const closeModal = async (withOutAPI = false) => {
    if (!withOutAPI) {
      await getItems();
    }
    setEditItem(null);
    setIsModalOpen(false);
  };

  const modalHandleChangeCat = () => {
    setIsModalOpenChangeCat(!isModalOpenChangeCat);
  };

  const userId = props?.policyInfo?.insuraceAccountDetails?.adjuster?.userId;
  const isCreatedSelected = claimContentListDataFull.filter(
    (item: any) => item.statusName === "CREATED" && item.selected === true
  );
  const isNotCreatedSelected = claimContentListDataFull.filter(
    (item: any) => item.statusName !== "CREATED" && item.selected === true
  );
  const isValuedSelected = claimContentListDataFull.filter(
    (item: any) => item.statusName === "VALUED" && item.selected === true
  );
  const isPaidSelected = claimContentListDataFull.filter(
    (item: any) => item.statusName === "PAID" && item.selected === true
  );
  const cashExposureTotalPrice = isValuedSelected
    .map((item: any) => +item.cashPayoutExposure)
    .reduce((a: any, b: any) => +(a + b), 0);

  const setItemLimitDetailsFromHOPolicyType = (ItemDetails: any) => {
    if (props.policyInfo.categories) {
      const categorySpecCovDet = props.policyInfo.categories.filter(
        (x: any) => x.name === ItemDetails.category.name
      );
      if (categorySpecCovDet) {
        ItemDetails.individualLimitAmount = categorySpecCovDet[0]
          ? categorySpecCovDet[0].individualItemLimit
          : 0;
      }
    }
  };

  const changeStatus = async (itemStatus: any) => {
    showDropDownMore();
    handleLoader();
    const selectedItems =
      claimContentListDataFull &&
      claimContentListDataFull.length > 0 &&
      claimContentListDataFull
        .filter((item: any) => item.selected === true)
        .map((item: any) => {
          const ItemDetails = { ...item };
          if (itemStatus === ITEM_STATUS.valued) {
            ItemDetails.adjusterDescription = item.description;
            if (!item?.category?.name) {
              const othersCategory = props.category.find(
                (catItem: any) => catItem.categoryName === "Others"
              );
              ItemDetails.category = {
                id: othersCategory.categoryId,
                name: othersCategory.categoryName,
              };
              if (!item?.subCategory?.name) {
                const othersSubCategory = props.subCategory.find(
                  (subItem: any) => subItem.name === "Others"
                );
                ItemDetails.subCategory = othersSubCategory;
              }
            }
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
            ItemDetails.replacementQty = ItemDetails.quantity;
            ItemDetails.rcvTotal = ItemDetails.totalStatedAmount;
            ItemDetails.replaced = true;
            setItemLimitDetailsFromHOPolicyType(ItemDetails);
            CalculateRCV(ItemDetails, props.subCategory);
          }
          return ItemDetails;
        });

    const param = {
      claimItems: selectedItems,
      itemStatus: itemStatus,
    };
    const resResult = await updateCliamStatus(param, token);
    if (resResult?.status === 200) {
      await getClaimSettlement(claimId, token);
      const claimContentListRes = await claimContentList({ claimId }, token);
      handleLoader();
      if (claimContentListRes) {
        props.addClaimContentListData({ claimContentData: claimContentListRes, claimId });
        props.addNotification({
          message: resResult.message,
          id: "mark_status_change_success",
          status: "success",
        });
      }
    } else {
      handleLoader();
      props.addNotification({
        message: resResult.errorMessage,
        id: "mark_status_change_failure",
        status: "error",
      });
    }
  };

  React.useEffect(() => {
    if (isCreatedSelected.length > 0) {
      setcheckStatus(true);
      setNumberSelected(isCreatedSelected.length);
    } else if (isNotCreatedSelected.length > 0) {
      setcheckStatus(true);
      setNumberSelected(isCreatedSelected.length);
    } else {
      setOpenMore(false);
      setcheckStatus(false);
      setNumberSelected(0);
    }
  }, [claimContentListDataFull]); // eslint-disable-line react-hooks/exhaustive-deps

  const BtnLabelWithIcon = ({ text, showDropDown }: any) => {
    return (
      <>
        {text}
        {!showDropDown ? <IoCaretDownSharp /> : <IoCaretUpSharp />}
      </>
    );
  };

  const fetchContentList = async (searchKeyword = "") => {
    const searchWord = searchKeyword ?? claimContentSearchKeyword;

    const claimContentList = await claimContentListDataFull.filter((obj: any) =>
      JSON.stringify(obj).toLowerCase().includes(searchWord.toLowerCase())
    );

    updateClaimContentListData({ claimContentList });

    return claimContentList;
  };
  return (
    <>
      {showLoader && <CustomLoader />}
      <div className="row mb-4">
        <div
          className={`${ContentListComponentStyle.contentListHeaderContainer} mt-4 pb-4`}
        >
          <GenericComponentHeading
            title={` ${translate?.contentListTranslate?.contentList ?? ""}
          (${claimContentListData.length})`}
            customHeadingClassname={ContentListComponentStyle.contentListHeader}
          />
        </div>

        <div className={ContentListComponentStyle.contentListContainer}>
          <div
            className={`row col-12 ${ContentListComponentStyle.contentListContentContainer}`}
          >
            <div className="col-md-9 col-sm-12 col-12 col-lg-9 d-flex ps-0">
              <div
                className={`row col-12 ${ContentListComponentStyle.contentListButtonDiv}`}
              >
                <div className={ContentListComponentStyle.OutsideClickHandlerDiv}>
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setShowDropDown(false);
                    }}
                  >
                    <Tooltip
                      anchorSelect="#my-anchor-element"
                      place="bottom"
                      isOpen={showDropDown}
                      hidden={!showDropDown}
                      openOnClick={true}
                      clickable={true}
                      className={ContentListComponentStyle.toolTipClass}
                    >
                      <div className="p-0">
                        <div
                          className={ContentListComponentStyle.dropDownInnerDiv}
                          onClick={openModal}
                        >
                          {translate?.contentListTranslate?.addItem ?? ""}
                        </div>

                        <div
                          className={ContentListComponentStyle.dropDownInnerDiv}
                          onClick={() =>
                            router.push(
                              `/core-logic/core-upload-items-from-csv?claimDetail=${claimId}`
                            )
                          }
                        >
                          {translate?.contentListTranslate?.loadFromFile ?? ""}
                        </div>
                      </div>
                    </Tooltip>
                    <GenericButton
                      label={
                        <BtnLabelWithIcon
                          text={translate?.contentListTranslate?.addItems}
                          showDropDown={showDropDown}
                        />
                      }
                      theme="coreLogic"
                      size="small"
                      type="submit"
                      btnClassname={ContentListComponentStyle.btnWithIcon}
                      id="my-anchor-element"
                      onClickHandler={handleDropDown}
                    />
                  </OutsideClickHandler>
                </div>

                <GenericButton
                  label={translate?.contentListTranslate?.mapReceipts ?? ""}
                  theme="coreLogic"
                  size="small"
                  type="submit"
                  btnClassname={ContentListComponentStyle.contentListBtn}
                  onClickHandler={() => {
                    addSessionData({
                      taxRate: props.taxRate ?? 0,
                    });
                    router.push(`/core-logic/core-receipts-mapper/${claimId}`);
                  }}
                />
                <div className={ContentListComponentStyle.OutsideClickHandlerDiv}>
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setOpenMore(false);
                    }}
                  >
                    <Tooltip
                      anchorSelect="#more-btn-element"
                      place="bottom"
                      isOpen={openMore}
                      hidden={!openMore}
                      openOnClick={true}
                      clickable={true}
                      afterHide={() => {
                        setOpenMore(false);
                      }}
                      className={ContentListComponentStyle.toolTipClass}
                    >
                      <div className="p-0">
                        <span className={ContentListComponentStyle.selectedItemsLine}>
                          ({getNumberSelected}){" "}
                          {translate?.contentListTranslate?.itemSelected ?? ""}
                        </span>
                        <div
                          className={ContentListComponentStyle.dropDownInnerDiv}
                          onClick={() => {
                            showDropDownMore();
                            modalHandleChangeCat();
                          }}
                        >
                          {translate?.contentListTranslate?.changeCategory ?? ""}
                        </div>

                        <div
                          id="more-status-btn-element"
                          onClick={() => {
                            setOpenStatus(!openStatus);
                          }}
                          className={ContentListComponentStyle.dropDownInnerDiv}
                        >
                          {translate?.contentListTranslate?.changeStatus ?? ""}
                        </div>
                        <Tooltip
                          anchorSelect="#more-status-btn-element"
                          place="right-start"
                          isOpen={openStatus}
                          hidden={!openStatus}
                          openOnClick={true}
                          clickable={true}
                          className={ContentListComponentStyle.toolTipClass}
                        >
                          <div className="p-0">
                            <div
                              className={clsx(
                                { "d-none": !(isCreatedSelected.length > 0) },
                                ContentListComponentStyle.dropDownInnerDiv
                              )}
                              onClick={() => {
                                changeStatus(ITEM_STATUS.valued);
                              }}
                            >
                              {translate?.contentListTranslate?.markValued ?? ""}
                            </div>
                            <div
                              className={clsx(
                                { "d-none": !(isValuedSelected.length > 0) },
                                ContentListComponentStyle.dropDownInnerDiv
                              )}
                              onClick={() => {
                                setOpenMore(false);
                                setIsModalOpenPaid(true);
                              }}
                            >
                              Mark Paid
                            </div>
                            <div
                              className={clsx(
                                { "d-none": !(isPaidSelected.length > 0) },
                                ContentListComponentStyle.dropDownInnerDiv
                              )}
                              onClick={() => {
                                changeStatus(ITEM_STATUS.settled);
                              }}
                            >
                              Mark Settled
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    </Tooltip>
                    <GenericButton
                      label={
                        <BtnLabelWithIcon
                          text={translate?.contentListTranslate?.more}
                          showDropDown={openMore}
                        />
                      }
                      theme="coreLogic"
                      size="small"
                      type="submit"
                      id="more-btn-element"
                      btnClassname={ContentListComponentStyle.btnWithIcon}
                      disabled={!checkedValues}
                      onClickHandler={showDropDownMore}
                    />
                  </OutsideClickHandler>
                </div>
                <GenericButton
                  label={translate?.contentListTranslate?.acceptMinValues ?? ""}
                  theme="coreLogic"
                  size="small"
                  type="submit"
                  btnClassname={ContentListComponentStyle.contentListBtn}
                  onClickHandler={() => setIsModalOpenAcceptMinVal(true)}
                />
              </div>
            </div>
            <div
              className="col-lg-3 col-md-3 col-sm-12 col-12 pe-0 d-flex align-items-end
"
            >
              <ContentListSearchBox
                setTableLoader={setTableLoader}
                fetchContentList={fetchContentList}
              />
            </div>
          </div>
          <div className="col-12">
            {isModalOpen && (
              <AddItemModal
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                editItem={editItem}
                editItemDetail={editItemDetail}
                contentData={claimContentListData}
              />
            )}
          </div>
          <AcceptMinValueModal
            isOpen={isModalOpenAcceptMinVal}
            onClose={handleModalAccepetMinVal}
            handleLoader={handleLoader}
            claimContentListDataFull={claimContentListDataFull}
            claimId={claimId}
          />
          <MarkAsPaidModal
            isOpen={isModalOpenPaid}
            onClose={handleModalPaid}
            handleLoader={handleLoader}
            claimId={claimId}
            userId={userId}
            isValuedSelected={isValuedSelected}
            cashExposureTotalPrice={cashExposureTotalPrice}
          />
          <ChangeCategoryModal
            closeModal={modalHandleChangeCat}
            isModalOpen={isModalOpenChangeCat}
            categoryListRes={categoryListRes}
            claimContentListDataFull={claimContentListDataFull}
            setShowLoader={setShowLoader}
          />
        </div>

        <ContentListTable
          claimId={claimId}
          setTableLoader={setTableLoader}
          tableLoader={tableLoader}
          setIsModalOpen={setIsModalOpen}
          setEditItem={setEditItem}
        />
      </div>
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  editItemDetail: state?.claimContentdata?.editItemDetail,
  claimContentListData: state?.claimContentdata?.claimContentListData,
  claimContentListDataFull: state?.claimContentdata?.claimContentListDataFull,
  claimContentSearchKeyword: state?.claimContentdata?.searchKeyword,
  policyInfo: state?.claimDetail && state?.claimDetail?.policyInfo,
  taxRate: state?.claimDetail?.contents?.taxRate,
  category: state?.commonData?.category || [],
  subCategory: state?.commonData?.subCategory || [],
  token: selectAccessToken(state),
});

const mapDispatchToProps = {
  addClaimContentListData,
  addNotification,
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setSelectedRows,
  setCategoryRows,
  updateClaimContentListData,
  addSessionData,
  addEditItemDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(CoreContentListComponent);
