"use client";
import React, { useContext } from "react";
import { useState } from "react";
import ContentListTable from "./ContentListTable";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import ContentListComponentStyle from "./ContentListComponent.module.scss";
import GenericButton from "@/components/common/GenericButton/index";
import { connect } from "react-redux";
import {
  addClaimContentListData,
  addEditItemDetail,
} from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import ContentListSearchBox from "./ContentListSearchBox/ContentListSearchBox";
import AddItemModal from "@/components/_adjuster_components/AddItemModal/AddItemModal";
import ChangeCategoryModal from "@/components/_adjuster_components/ChangeCategoryModal/ChangeCategoryModal";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import {
  getClaimSettlement,
  updateCliamStatus,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
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
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import SupervisorReviewModal from "../../../common/SupervisorReviewModal";
import AcceptMinValueModal from "./AcceptMinValueModal";
import MarkAsPaidModal from "./MarkAsPaidModal";
import { ITEM_STATUS } from "@/constants/constants";
import AcceptStdCostModal from "./AcceptStdCostModal";
import { CalculateRCV, setItemLimitDetailsFromHOPolicyType } from "@/utils/calculateRCV";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import OutsideClickHandler from "react-outside-click-handler";

function ContentListComponent(props: any) {
  const {
    addClaimContentListData,
    claimId,
    editItemDetail,
    claimContentListData,
    claimContentListDataFull,
    categoryListRes,
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
  const [isCreatedItemvAilable, setIsCreatedItemAvailable] = useState(false);
  const [getNumberSelected, setNumberSelected] = useState(0);
  const [openStatus, setOpenStatus] = useState(false);
  const [isModalOpenSuperVisor, setIsModalOpenSuperVisor] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpenChangeCat, setIsModalOpenChangeCat] = useState<boolean>(false);
  const [isModalOpenAcceptStandardCost, setIsModalOpenAcceptStandardCost] =
    useState<boolean>(false);
  const [msgAcceptStandardCost, setMsgAcceptStandardCost] = useState("");
  const [acceptStandardCostItem, setAcceptStandardCostItem] =
    useState<React.SetStateAction<any>>(null);
  React.useEffect(() => {}, []);
  const dispatch = useAppDispatch();
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const getItems = async () => {
    setTableLoader(true);
    const claimContentListRes: any = await claimContentList(
      {
        claimId: claimId,
      },
      true
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
    addEditItemDetail({ itemDetailData: {}, previousItem: false, nextItem: false });
    setEditItem(null);
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

  const modalHandleAcceptStandard = () => {
    setIsModalOpenAcceptStandardCost(!isModalOpenAcceptStandardCost);
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
  const isNotUnderReviewSelected = claimContentListDataFull.filter(
    (item: any) => item.statusName !== "UNDER REVIEW" && item.selected === true
  );
  const cashExposureTotalPrice = isValuedSelected
    .map((item: any) => +item.cashPayoutExposure)
    .reduce((a: any, b: any) => +(a + b), 0);

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
            setItemLimitDetailsFromHOPolicyType(ItemDetails, props.policyInfo);
            CalculateRCV(ItemDetails, props.subCategory);
          }
          return ItemDetails;
        });

    const param = {
      claimItems: selectedItems,
      itemStatus: itemStatus,
    };
    const resResult = await updateCliamStatus(param);
    if (resResult?.status === 200) {
      await getClaimSettlement(claimId, true);
      const claimContentListRes = await claimContentList({ claimId }, true);
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

  const handleSupervisorModal = () => {
    setIsModalOpenSuperVisor(!isModalOpenSuperVisor);
  };

  React.useEffect(() => {
    if (isCreatedSelected.length > 0) {
      setIsCreatedItemAvailable(true);
      setcheckStatus(true);
      setNumberSelected(isCreatedSelected.length);
    } else if (isNotCreatedSelected.length > 0) {
      setIsCreatedItemAvailable(false);
      setcheckStatus(true);
      setNumberSelected(isCreatedSelected.length);
    } else {
      setIsCreatedItemAvailable(false);
      setOpenMore(false);
      setcheckStatus(false);
      setNumberSelected(0);
    }
  }, [claimContentListDataFull]); // eslint-disable-line react-hooks/exhaustive-deps

  const acceptStandardCost = () => {
    const acceptStandardCostThreshold = 50;
    const selectedItems: any[] = [];

    if (claimContentListDataFull && claimContentListDataFull.length <= 0) {
      props.addNotification({
        message: "There is no items to accept standard cost",
        id: "mark_status_valued_success",
        status: "error",
      });
    } else {
      claimContentListDataFull.forEach((item: any) => {
        const ItemDetails = { ...item };
        const originalCost =
          ItemDetails.unitCost ??
          ItemDetails.totalStatedAmount / (ItemDetails.quantity ?? 1);

        if (originalCost <= acceptStandardCostThreshold && !!item.standardCost) {
          const twentyPerCost = 0.2 * originalCost;
          let standardReplacementCost;
          if (originalCost > 0) {
            standardReplacementCost =
              originalCost - twentyPerCost <= ItemDetails.standardCost &&
              originalCost + twentyPerCost >= ItemDetails.standardCost
                ? ItemDetails.standardCost
                : originalCost;
          } else {
            standardReplacementCost = ItemDetails.standardCost;
          }
          if (
            originalCost - twentyPerCost <= item.standardCost &&
            originalCost + twentyPerCost >= item.standardCost &&
            item.status.status === "CREATED" &&
            standardReplacementCost < 60
          ) {
            ItemDetails.replaced = true;
            ItemDetails.adjusterDescription =
              ItemDetails.standardDescription ?? item.description;
            ItemDetails.rcv = standardReplacementCost;
            ItemDetails.replacedItemPrice = standardReplacementCost;
            ItemDetails.replacementQty = item.quantity ?? 1;
            ItemDetails.source = item.standardItemSource;
            CalculateRCV(ItemDetails, props.subCategory);

            if (ItemDetails.rcvTotal === null) {
              ItemDetails.rcv = standardReplacementCost;
              ItemDetails.rcvTotal = parseFloatWithFixedDecimal(
                standardReplacementCost * ItemDetails.quantity ?? 1
              );
            }
            selectedItems.push(ItemDetails);
          }
        }
      });
    }

    const originalCostTotal = selectedItems
      .map((item) => item.totalStatedAmount)
      .reduce((a, b) => a + b, 0);
    const standardCostTotal = selectedItems
      .map((item) => item.rcvTotal)
      .reduce((a, b) => a + b, 0);

    if (selectedItems && selectedItems.length <= 0) {
      props.addNotification({
        message: "There are no such items to accept standard replacement cost",
        id: "mark_status_valued_success",
        status: "warning",
      });
    } else {
      const message = `A total of ${
        selectedItems.length
      } items originally priced at a total of 
        $${originalCostTotal.toFixed(2)} have standard replacements 
        available for $${standardCostTotal.toFixed(2)}. Would you like to accept 
        the standard costs for these items?`;
      modalHandleAcceptStandard();
      setMsgAcceptStandardCost(message);
      setAcceptStandardCostItem(selectedItems);
    }
  };

  const BtnLabelWithIcon = ({ text, showDropDown }: any) => {
    return (
      <>
        {text}
        {!showDropDown ? <IoCaretDownSharp /> : <IoCaretUpSharp />}
      </>
    );
  };
  const createAssignmentClick: any = () => {
    document.getElementById("vendorassignments")?.click();
    sessionStorage.setItem(
      "createVendorAss",
      JSON.stringify({ vendorAssignment: true, index: 2 })
    );
    const modifiedClaimContentListData = claimContentListDataFull.map((item: any) => {
      return Object.assign({}, item, { uuid: item.itemUID });
    });
    dispatch(setAddItemsTableData(modifiedClaimContentListData));
    const filteredObject: any = modifiedClaimContentListData.filter(
      (obj: any) => obj.selected
    );
    dispatch(setSelectedItems(filteredObject));
    dispatch(setSelectedRows(filteredObject));
    setTimeout(() => {}, 1000);
  };

  return (
    <>
      {showLoader && <CustomLoader />}
      <div className="row mb-4">
        <div className={`${ContentListComponentStyle.contentListHeaderContainer} mt-4`}>
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
                            router.push(`/upload-items-from-csv?claimDetail=${claimId}`)
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
                      tableBtn
                      theme="normal"
                      size="small"
                      type="submit"
                      btnClassname={ContentListComponentStyle.btnWithIcon}
                      id="my-anchor-element"
                      onClickHandler={handleDropDown}
                    />
                  </OutsideClickHandler>
                </div>
                <GenericButton
                  label={translate?.contentListTranslate?.createAssignment ?? ""}
                  theme="normal"
                  tableBtn
                  size="small"
                  type="submit"
                  btnClassname={ContentListComponentStyle.contentListBtn}
                  disabled={!isCreatedItemvAilable}
                  onClick={createAssignmentClick}
                />
                <GenericButton
                  label={translate?.contentListTranslate?.mapReceipts ?? ""}
                  theme="normal"
                  size="small"
                  tableBtn
                  type="submit"
                  btnClassname={ContentListComponentStyle.contentListBtn}
                  onClickHandler={() => {
                    sessionStorage.setItem("taxRate", props.taxRate ?? 0);
                    router.push(`/receipts-mapper/${claimId}`);
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
                            <div
                              className={ContentListComponentStyle.dropDownInnerDiv}
                              onClick={() => {
                                showDropDownMore();
                                handleSupervisorModal();
                              }}
                            >
                              {translate?.contentListTranslate?.supervisorReview ?? ""}
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
                      tableBtn
                      theme="normal"
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
                  theme="normal"
                  size="small"
                  type="submit"
                  tableBtn
                  btnClassname={ContentListComponentStyle.contentListBtn}
                  onClickHandler={() => setIsModalOpenAcceptMinVal(true)}
                />
                <GenericButton
                  label={translate?.contentListTranslate?.acceptStandardCost ?? ""}
                  theme="normal"
                  size="small"
                  tableBtn
                  type="submit"
                  btnClassname={ContentListComponentStyle.contentListBtn}
                  onClickHandler={() => acceptStandardCost()}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 col-12 px-0">
              <ContentListSearchBox setTableLoader={setTableLoader} />
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
          <AcceptStdCostModal
            isOpen={isModalOpenAcceptStandardCost}
            onClose={modalHandleAcceptStandard}
            handleLoader={handleLoader}
            claimContentListDataFull={claimContentListDataFull}
            claimId={claimId}
            msgAcceptStandardCost={msgAcceptStandardCost}
            acceptStandardCostItem={acceptStandardCostItem}
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
        <SupervisorReviewModal
          isOpen={isModalOpenSuperVisor}
          onClose={handleSupervisorModal}
          claimId={claimId}
          isNotUnderReviewSelected={isNotUnderReviewSelected}
          reviewType="ITEMS"
        />
        <ContentListTable
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
  policyInfo: state?.claimDetail && state?.claimDetail?.policyInfo,
  taxRate: state?.claimDetail?.contents?.taxRate,
  category: state?.commonData?.category || [],
  subCategory: state?.commonData?.subCategory || [],
});

const mapDispatchToProps = {
  addClaimContentListData,
  addNotification,
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setSelectedRows,
  setCategoryRows,
  addEditItemDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentListComponent);
