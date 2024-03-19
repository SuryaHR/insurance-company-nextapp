import { useEffect, useRef } from "react";

interface propType {
  methods: () => void;
}

function useInitHook(props: propType) {
  const { methods } = props;
  const initLoad = useRef(false);
  useEffect(() => {
    if (!initLoad.current) {
      methods && methods();
      initLoad.current = true;
    }
  }, [methods]);
}

export default useInitHook;
