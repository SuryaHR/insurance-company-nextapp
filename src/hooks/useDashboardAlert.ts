import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import { addAlert } from "@/reducers/DashboardAlert/DashboardAlertSlice";
import { useEffect } from "react";

function useDashboardAlert(data: any) {
  const dispatch = useAppDispatch();
  const alertSelector = useAppSelector((state) => state.alert);

  useEffect(() => {
    if (!alertSelector.isLoaded) {
      dispatch(addAlert({ ...data, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loaded: alertSelector?.isLoaded,
  };
}

export default useDashboardAlert;
