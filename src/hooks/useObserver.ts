import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "./reduxCustomHook";
import {
  fetchAlertNotification,
  isFetchingSelector,
  isLastPageSelector,
} from "@/reducers/DashboardAlert/DashboardAlertSlice";

function useObserver() {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const isLastPage = useAppSelector(isLastPageSelector);
  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && !isFetching && !isLastPage) {
      dispatch(fetchAlertNotification());
    }
  }, [inView, dispatch, isFetching, isLastPage]);

  return { ref, inView, isFetching, isLastPage };
}

export default useObserver;
