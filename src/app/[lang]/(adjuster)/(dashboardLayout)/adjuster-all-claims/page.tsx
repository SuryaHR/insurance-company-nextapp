import AdjusterAllClaim from "@/container/_adjuster_container/AdjusterAllClaimContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";

export default function adjusterDashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <AdjusterAllClaim />
    </Suspense>
  );
}
