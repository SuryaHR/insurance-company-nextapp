import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import AdjusterAssignServiceRequestContainer from "@/container/AdjusterAssignServiceRequestContainer";

export default function Page({ params }: { params: { serviceRequestId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <AdjusterAssignServiceRequestContainer serviceRequestId={params.serviceRequestId} />
    </Suspense>
  );
}
