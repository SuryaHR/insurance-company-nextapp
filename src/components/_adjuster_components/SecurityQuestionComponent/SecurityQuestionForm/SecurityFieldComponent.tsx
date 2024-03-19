import React from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import GenericSelect from "@/components/common/GenericSelect";
import securityQuestionFormStyle from "./securityQuestionForm.module.scss";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";

const SecurityFieldComponent = ({
  control,
  options,
  errors,
  register,
  inputData,
}: any) => {
  const {
    selectLabel,
    selectPlaceholder,
    inputPlaceholder,
    inputLabel,
    inputId,
    inputName,
    selectName,
  } = inputData;
  return (
    <div className={clsx("d-flex flex-column", securityQuestionFormStyle.formGroup)}>
      <Controller
        control={control}
        name={selectName}
        rules={{ required: true }}
        render={({ field: { ...rest } }: any) => (
          <GenericSelect
            labelText={selectLabel}
            placeholder={selectPlaceholder}
            options={options}
            showError={errors[selectName]}
            errorMsg={errors[selectName]?.message}
            name={selectName}
            {...rest}
          />
        )}
      />
      <GenericUseFormInput
        placeholder={inputPlaceholder}
        label={inputLabel}
        id={inputId}
        showError={errors[inputName]}
        errorMsg={errors[inputName]?.message}
        isFixedError={true}
        {...register(inputName)}
      />
    </div>
  );
};

export default SecurityFieldComponent;
