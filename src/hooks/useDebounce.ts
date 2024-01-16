import { unknownObjectType } from "@/constants/customTypes";
import { useEffect, useRef } from "react";

const useDebounce = (callback: (value: unknownObjectType) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = (obj: unknownObjectType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(obj);
    }, delay);
  };

  return debouncedCallback;
};

export default useDebounce;
