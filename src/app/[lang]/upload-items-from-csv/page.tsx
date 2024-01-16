import { Suspense } from "react";
import Loading from "../loading";

import UploadItemsFromCsvContainer from "@/container/UploadItemsFromCsvContainer";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UploadItemsFromCsvContainer />
    </Suspense>
  );
}
