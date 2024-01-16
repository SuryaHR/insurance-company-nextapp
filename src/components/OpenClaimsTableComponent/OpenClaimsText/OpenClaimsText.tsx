"use client";
import React, { useEffect, useState } from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { useAppSelector } from "@/hooks/reduxCustomHook";

const OpenClaimsText: React.FC = () => {
  const [claimCount, setTotalClaimCount] = useState(0);
  const useSelector = useAppSelector((state) => state?.claimdata?.totalClaims);
  useEffect(() => {
    if (useSelector) {
      setTotalClaimCount(useSelector);
    }
  }, [useSelector]);
  return (
    <div>
      <GenericComponentHeading title={`Open Claims (${claimCount})`} />
    </div>
  );
};

export default OpenClaimsText;
