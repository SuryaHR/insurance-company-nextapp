import { unknownObjectType } from "@/constants/customTypes";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { BaseSchema, Output } from "valibot";

function useCustomForm<T extends BaseSchema>(
  schema: T,
  defaultValue?: unknownObjectType
) {
  const initState: any = {
    resolver: valibotResolver(schema),
  };
  if (defaultValue) {
    initState["defaultValues"] = defaultValue;
  }
  const {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    watch,
    resetField,
    reset,
    setError,
    clearErrors,
    getValues,
  } = useForm<Output<typeof schema>>(initState);

  // useForm<Output<typeof schema>>({
  //   resolver: valibotResolver(schema),
  // });
  return {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    watch,
    resetField,
    reset,
    setError,
    clearErrors,
    getValues,
  };
}

export default useCustomForm;
