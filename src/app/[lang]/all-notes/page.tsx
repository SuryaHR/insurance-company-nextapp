import AllNotesContainer from "@/container/AllNotesContainer";
import { Suspense } from "react";
import Loading from "../loading";

// import { Locale } from "@/i18n.config";

export default async function AllNotes() {
  return (
    <Suspense fallback={<Loading />}>
      <AllNotesContainer />
    </Suspense>
  );
}
