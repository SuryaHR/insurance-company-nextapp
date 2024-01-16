import {
  addNotification,
  removeNotification,
} from "@/reducers/Notification/NotificationSlice";
import { useAppDispatch } from "./reduxCustomHook";

type notifyStatus = "success" | "error" | "warning";

type NotifyType = {
  message: string;
  status?: notifyStatus;
  position?: string;
  id: string;
};

function useNotification() {
  const dispatch = useAppDispatch();
  const showNotification = (data: NotifyType) => {
    dispatch(addNotification(data));
  };

  const hideNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return { showNotification, hideNotification };
}

export default useNotification;
