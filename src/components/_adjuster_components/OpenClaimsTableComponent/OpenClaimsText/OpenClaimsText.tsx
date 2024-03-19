"use client";
import React, { useEffect, useState } from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { useAppSelector } from "@/hooks/reduxCustomHook";

interface OpenClaimsTextProps {
  translate?: any;
}

const OpenClaimsText: React.FC<OpenClaimsTextProps> = ({ translate }) => {
  const [claimCount, setTotalClaimCount] = useState(0);
  const useSelector = useAppSelector((state) => state?.claimdata?.totalClaims);
  useEffect(() => {
    if (useSelector) {
      setTotalClaimCount(useSelector);
    }
  }, [useSelector]);
  return (
    <div>
      <GenericComponentHeading
        title={
          translate?.adjusterDashboardTranslate?.adjusterDashboard
            ?.OpenClaimsTableComponent?.OpenClaimsText?.OpenClaims + ` (${claimCount})`
        }
      />
    </div>
  );
};

export default OpenClaimsText;
