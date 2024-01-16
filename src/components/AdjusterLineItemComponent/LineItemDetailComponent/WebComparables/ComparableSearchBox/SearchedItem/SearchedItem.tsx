import React from "react";
import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import searchedItemStyle from "./searchedItem.module.scss";
import { SEARCH_COMPARABLE_DESC_LIMIT } from "@/constants/constants";
import GenericButton from "@/components/common/GenericButton";
import { getUSDCurrency } from "@/utils/utitlity";
import StarRating from "@/components/common/StarRating/StarRating";

type propsType = {
  key: number;
  data: unknownObjectType;
};

function SearchedItem(props: propsType) {
  const { key, data = {} } = props;
  const imgUrl = data?.itemImage;

  const getShortDesc = (desc: string) => {
    if (desc.length > 60) return desc.slice(0, SEARCH_COMPARABLE_DESC_LIMIT) + "...";
    return desc;
  };

  return (
    <div key={key} className={searchedItemStyle.root}>
      <div className={searchedItemStyle.imageDiv}>
        <Image
          unoptimized={true}
          src={imgUrl}
          alt="products"
          fill={true}
          sizes="100%"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={searchedItemStyle.content}>
        <div className={searchedItemStyle.descDiv}>
          <div className={searchedItemStyle.descDetail}>
            <div className={searchedItemStyle.desc}>
              {getShortDesc(data?.description)}
            </div>
            <div className={searchedItemStyle.rating}>
              <StarRating rating={data?.rating ?? 0} />
            </div>
          </div>
          <div className={searchedItemStyle.merchant}>
            <span>Merchant: </span>
            {data?.merchant ?? ""}
          </div>
          <a target="_blank" href={data?.itemURL ?? "#"}>
            View More
          </a>
        </div>
        <div className={searchedItemStyle.actionDiv}>
          <div className={searchedItemStyle.price}>
            {getUSDCurrency(+data?.itemPrice ?? 0)}
          </div>
          <GenericButton
            label="Mark as Replacement"
            theme="existingDarkBlueBtn"
            size="medium"
          />
          <GenericButton
            label="Add to Comparable"
            theme="existingDarkBlueBtn"
            size="medium"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchedItem;
