import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import React, { useContext } from "react";
import comparableItemStyle from "./comparableItem.module.scss";
import {
  ITEM_STATUS,
  NO_IMAGE,
  SEARCH_COMPARABLE_DESC_LIMIT,
} from "@/constants/constants";
import StarRating from "@/components/common/StarRating/StarRating";
import { getUSDCurrency } from "@/utils/utitlity";
import GenericButton from "@/components/common/GenericButton";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import {
  addtoComparableList,
  deleteCustomItem,
} from "@/reducers/_core_logic_reducers/LineItemDetail/LineItemThunkService";
import { removeComparableItem } from "@/reducers/_core_logic_reducers/LineItemDetail/LineItemDetailSlice";
import selectItemCategory from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemCategory";
import { LineItemContext } from "../../LineItemContext";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import selectItemStatus from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemStatus";
type propsType = {
  key: string;
  data: unknownObjectType;
};

function ComparableItem(props: propsType) {
  const { key, data = {} } = props;
  const imgUrl = data?.imageURL ?? NO_IMAGE;
  const lineItemStatus = useAppSelector(selectItemStatus);
  const dispatch = useAppDispatch();
  const {
    inView,
    setShowLoader,
    categoryRef,
    subCategoryRef,
    rapidSubCategoryRef,
    rapidcategoryRef,
    handleItemReplace,
    files,
    clearFile,
  } = useContext(LineItemContext);
  const selectedCategory = useAppSelector(selectItemCategory);

  const getShortDesc = (desc: string) => {
    if (desc.length > 60) return desc.slice(0, SEARCH_COMPARABLE_DESC_LIMIT) + "...";
    return desc;
  };

  const removeFromComparableList = (item: unknownObjectType) => {
    if (item?.customItem) {
      dispatch(deleteCustomItem(item));
    } else {
      dispatch(removeComparableItem({ id: item?.id }));
    }
  };

  const markAsReplacement = () => {
    if (!selectedCategory?.category && !selectedCategory?.subCategory) {
      if (inView) {
        if (categoryRef?.current) {
          categoryRef.current.focus();
        }
      } else if (rapidcategoryRef?.current) {
        rapidcategoryRef?.current?.focus();
      }
      dispatch(
        addNotification({
          message: "Please select category and subcategory",
          id: new Date().valueOf(),
          status: "warning",
        })
      );
    } else if (!selectedCategory?.subCategory) {
      if (inView) {
        if (subCategoryRef?.current) {
          subCategoryRef.current.focus();
        }
      } else if (rapidSubCategoryRef?.current) {
        rapidSubCategoryRef?.current?.focus();
      }
      dispatch(
        addNotification({
          message: "Please select subcategory",
          id: new Date().valueOf(),
          status: "warning",
        })
      );
    } else {
      setShowLoader(true);
      dispatch(
        addtoComparableList({
          item: data,
          isReplacement: true,
          attachmentList: files,
          clbk: () => {
            handleItemReplace();
            setShowLoader(false);
            clearFile();
          },
        })
      );
    }
  };

  return (
    <div key={key} className={comparableItemStyle.root}>
      {data?.customItem && <div className={comparableItemStyle.customTag}>Custom</div>}
      <div className={comparableItemStyle.imageDiv}>
        <Image
          unoptimized={true}
          src={imgUrl}
          alt="products"
          fill={true}
          sizes="100%"
          style={{ objectFit: "contain" }}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = NO_IMAGE;
          }}
        />
      </div>
      <div className={comparableItemStyle.content}>
        <div className={comparableItemStyle.descDiv}>
          <div className={comparableItemStyle.descDetail}>
            <div className={comparableItemStyle.desc}>
              {getShortDesc(data?.description)}
            </div>
            <div className={comparableItemStyle.rating}>
              <StarRating rating={data?.rating ?? 0} />
            </div>
          </div>
          <div className={comparableItemStyle.merchant}>
            <span>Merchant: </span>
            {data?.supplier ?? ""}
          </div>
          <a target="_blank" href={data?.itemURL ?? "#"}>
            View More
          </a>
        </div>
        <div className={comparableItemStyle.actionDiv}>
          {lineItemStatus.status !== ITEM_STATUS.underReview && (
            <div className={comparableItemStyle.removeIcon}>
              <IoMdClose onClick={() => removeFromComparableList(data)} size={20} />
            </div>
          )}
          <div className={comparableItemStyle.price}>
            {getUSDCurrency(+data?.price ?? 0)}
          </div>
          <GenericButton
            label="Mark as Replacement"
            theme="coreLogic"
            size="medium"
            onClickHandler={markAsReplacement}
            disabled={lineItemStatus.status === ITEM_STATUS.underReview}
          />
        </div>
      </div>
    </div>
  );
}

export default ComparableItem;
