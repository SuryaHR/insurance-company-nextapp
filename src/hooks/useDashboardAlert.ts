import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import { addAlert } from "@/reducers/_adjuster_reducers/DashboardAlert/DashboardAlertSlice";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import { getNotification } from "@/services/_adjuster_services/ClaimService";
import useInitHook from "./useInitHook";

function useDashboardAlert() {
  const dispatch = useAppDispatch();
  const alertSelector = useAppSelector((state) => state.alert);
  const userId = useAppSelector(selectLoggedInUserId);

  const fetchAlertNotification = async () => {
    try {
      const data = await getNotification({ id: userId, page: 1 }, true);
      dispatch(addAlert({ ...data, page: 1 }));
    } catch (error) {
      console.log("fetchAlertNotification_error", error);
    }
  };

  useInitHook({ methods: fetchAlertNotification });

  return {
    loaded: alertSelector?.isLoaded,
  };
}

export default useDashboardAlert;
