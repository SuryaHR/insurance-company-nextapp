import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import UserProfileContainer from "@/container/_adjuster_container/UserProfileContainer/UserProfileContainer";
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfileContainer />
    </Suspense>
  );
}
