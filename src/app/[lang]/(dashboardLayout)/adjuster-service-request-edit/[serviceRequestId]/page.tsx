import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import AdjusterServiceRequestEditContainer from "@/container/AdjusterServiceRequestEditContainer";

export default function Page({ params }: { params: { serviceRequestId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <AdjusterServiceRequestEditContainer serviceRequestId={params.serviceRequestId} />
    </Suspense>
  );
}
