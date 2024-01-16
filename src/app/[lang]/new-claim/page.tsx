import { Suspense } from "react";
import Loading from "../loading";
import NewclaimsContainer from "@/container/NewClaimsContainer/index";

export default async function NewClaims() {
  return (
    <Suspense fallback={<Loading />}>
      <NewclaimsContainer />;
    </Suspense>
  );
}
