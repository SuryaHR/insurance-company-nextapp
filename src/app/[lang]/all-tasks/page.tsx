import AllTasksComponent from "@/components/AllTasksComponent/AllTasksComponent";
import { Suspense } from "react";
import Loading from "../loading";

// import { Locale } from "@/i18n.config";

export default async function AllTasks() {
  return (
    <Suspense fallback={<Loading />}>
      <AllTasksComponent />
    </Suspense>
  );
}
