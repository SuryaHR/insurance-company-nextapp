import React from "react";
import clsx from "clsx";
import ClaimInformationStyle from "./claimInformation.module.scss";
import { IoMdCloseCircle } from "react-icons/io";
import GenericCurrencyFormat from "@/components/common/GenericInput/GenericCurrencyFormat";

function CategoryCoverage(props: any) {
  return (
    <div
      className={clsx(
        "row d-flex justify-content-end",
        ClaimInformationStyle.categoryName
      )}
    >
      <div className="col-lg-3" />
      <div className={clsx("col-lg-3", ClaimInformationStyle.value)}>
        {props.data?.categoryName}
      </div>
      <div className={clsx("col-lg-2 pb-1", ClaimInformationStyle.aggregateStyle)}>
        <GenericCurrencyFormat
          placeholder="$0.00"
          inputFieldClassname="hideInputArrow"
          handleChange={({ value }: any) => {
            // setcoverageLimit(value);
            props.changeHOvalue(props.data?.categoryName, "coverageLimit", Number(value));
          }}
          defaultValue={props.data?.coverageLimit}
        />
      </div>
      <div className={clsx("col-lg-2", ClaimInformationStyle.itemLimitSTyle)}>
        <GenericCurrencyFormat
          placeholder="$0.00"
          inputFieldClassname="hideInputArrow"
          handleChange={({ value }: any) => {
            props.changeHOvalue(
              props.data?.categoryName,
              "individualItemLimit",
              Number(value)
            );
          }}
          defaultValue={props.data?.individualItemLimit}
        />
      </div>
      <div className={clsx("col-lg-1")}>
        <div className={clsx(ClaimInformationStyle.deleteButton)}>
          <IoMdCloseCircle
            className={ClaimInformationStyle.closeCircle}
            onClick={() => props.handleDelete(props.data?.categoryId)}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryCoverage;
