import OpenClaimsTableComponent from "@/components/_adjuster_components/OpenClaimsTableComponent";
import React from "react";

function OpenClaimsTableContainer(props: { translate: any }) {
  const { translate } = props;
  return (
    <div>
      <OpenClaimsTableComponent translate={translate} />
    </div>
  );
}

export default OpenClaimsTableContainer;
