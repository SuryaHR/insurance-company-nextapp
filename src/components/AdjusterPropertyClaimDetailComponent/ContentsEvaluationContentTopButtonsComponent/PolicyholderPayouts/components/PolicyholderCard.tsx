import React from "react";
import style from "./policyholderCard.module.scss";
import Cards from "@/components/common/Cards";

function PolicyholderCard({ heading, value }: { heading: string; value: string }) {
  return (
    <Cards className={style.card}>
      <div className={style.bold}>{heading}</div>
      <div className={style.value}>{value}</div>
    </Cards>
  );
}

export default PolicyholderCard;
