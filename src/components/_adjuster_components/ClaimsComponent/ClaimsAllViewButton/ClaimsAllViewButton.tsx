"use client";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import ClaimsButtonStyle from "./claimsAllViewButton.module.scss";
import { adjusterDashboardTranslateProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-dashboard/page";

const ClaimsAllViewButton: React.FC = () => {
  const { translate } =
    useContext<TranslateContextData<adjusterDashboardTranslateProp>>(TranslateContext);
  return (
    <div className="text-right">
      <a href="/claims-need-attention" className={ClaimsButtonStyle.anchorStyle}>
        {
          translate?.adjusterDashboardTranslate?.adjusterDashboard?.ClaimsNeedAttention
            ?.ClaimsComponent.ClaimsAllViewButton.viewAllUrgentClaims
        }{" "}
      </a>
    </div>
  );
};

export default ClaimsAllViewButton;
