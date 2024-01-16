import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import React from "react";
import comparableItemStyle from "./comparableItem.module.scss";
import { NO_IMAGE, SEARCH_COMPARABLE_DESC_LIMIT } from "@/constants/constants";
import StarRating from "@/components/common/StarRating/StarRating";
import { getUSDCurrency } from "@/utils/utitlity";
import GenericButton from "@/components/common/GenericButton";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { deleteCustomItem } from "@/reducers/LineItemDetail/LineItemThunkService";

type propsType = {
  key: number;
  data: unknownObjectType;
};

function ComparableItem(props: propsType) {
  const { key, data = {} } = props;
  const imgUrl = data?.imageURL ?? NO_IMAGE;
  const dispatch = useAppDispatch();

  const getShortDesc = (desc: string) => {
    if (desc.length > 60) return desc.slice(0, SEARCH_COMPARABLE_DESC_LIMIT) + "...";
    return desc;
  };

  const removeFromComparableList = (item: unknownObjectType) => {
    if (item?.customItem) {
      dispatch(deleteCustomItem(item));
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
          <div className={comparableItemStyle.removeIcon}>
            <IoMdClose onClick={() => removeFromComparableList(data)} size={20} />
          </div>
          <div className={comparableItemStyle.price}>
            {getUSDCurrency(+data?.price ?? 0)}
          </div>
          <GenericButton
            label="Mark as Replacement"
            theme="existingDarkBlueBtn"
            size="medium"
          />
        </div>
      </div>
    </div>
  );
}

export default ComparableItem;
