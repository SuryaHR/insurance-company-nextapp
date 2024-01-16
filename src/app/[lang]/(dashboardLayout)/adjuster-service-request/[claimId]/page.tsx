import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import AdjusterServiceRequestContainer from "@/container/AdjusterServiceRequestContainer";

export default function Page({ params }: { params: { claimId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <AdjusterServiceRequestContainer claimId={params.claimId} />
    </Suspense>
  );
}
