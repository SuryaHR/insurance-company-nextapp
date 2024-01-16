import React, { useState, useEffect } from "react";
import GenericInput from "../common/GenericInput/index";
import clsx from "clsx";
import ClaimInformationStyle from "./claimInformation.module.scss";
// import SearchBoxAssignItems from "./SearchBoxAssignItems";
import { IoMdCloseCircle } from "react-icons/io";

function CategoryCoverage(props: any) {
  const [coverageValue, setCoverageValue] = useState("");
  const [individualLimitValue, setindividualLimitValue] = useState("");
  {
    console.log("coverageLimit", props.data.coverageLimit);
  }
  const checkData = (e: any) => {
    console.log("target", e.target.value);
    setCoverageValue(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(e.target.value)
    );
  };

  const checkIndividualData = (e: any) => {
    setindividualLimitValue(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(e.target.value)
    );
  };

  useEffect(() => {
    setCoverageValue(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(props.data.coverageLimit) ?? 0.0
    );
  }, [props.data.coverageLimit]);

  useEffect(() => {
    setindividualLimitValue(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(props.data.individualItemLimit) ?? 0.0
    );
  }, [props.data.individualItemLimit]);

  return (
    <div
      className={clsx(
        "row d-flex   justify-content-end ",
        ClaimInformationStyle.categoryName
      )}
    >
      <div className="col-lg-3" />
      <div className={clsx("col-lg-3  ", ClaimInformationStyle.value)}>
        {props.data.categoryName}
      </div>
      <div className={clsx("col-lg-2  pb-1", ClaimInformationStyle.aggregateStyle)}>
        <GenericInput
          type="text"
          value={coverageValue ?? 0}
          // inputFieldClassname={ClaimInformationStyle.aggregateStyle}
          onClick={
            () => setCoverageValue(props.data.coverageLimit)
            // if(props.data.coverageLimit === null)
            // setCoverageValue("000")
          }
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setCoverageValue(e.target.value)
          }
          onBlur={(e: any) => checkData(e)}
        />
      </div>
      <div className={clsx("col-lg-2 ", ClaimInformationStyle.itemLimitSTyle)}>
        <GenericInput
          type="text"
          //   {...register("indivudualItemLimit")}
          value={individualLimitValue ?? 0}
          // inputFieldClassname={ClaimInformationStyle.itemLimitSTyle}
          onClick={() => setindividualLimitValue(props.data.individualItemLimit)}
          onChange={(e: { target: { value: any } }) =>
            setindividualLimitValue(e.target.value)
          }
          onBlur={(e: any) => checkIndividualData(e)}
        />
      </div>
      <div className={clsx("col-lg-1")}>
        <button
          className={clsx(ClaimInformationStyle.deleteButton)}
          type="button"
          onClick={() => props.handleDelete(props.data.categoryId)}
        >
          <IoMdCloseCircle className={ClaimInformationStyle.closeCircle} />
        </button>
      </div>
    </div>
  );
}

export default CategoryCoverage;
