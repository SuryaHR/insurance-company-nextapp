import AdjusterDashboard from "@/container/AdjusterDashboardContainer";
import { Suspense } from "react";
import Loading from "../../loading";

export default function adjusterDashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <AdjusterDashboard />;
    </Suspense>
  );
}
