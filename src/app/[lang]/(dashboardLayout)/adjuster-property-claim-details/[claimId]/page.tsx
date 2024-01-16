import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import AdjusterPropertyClaimDetailContainer from "@/container/AdjusterPropertyClaimDetailContainer";

export default function Page({ params }: { params: { claimId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <AdjusterPropertyClaimDetailContainer claimId={params.claimId} />
    </Suspense>
  );
}
