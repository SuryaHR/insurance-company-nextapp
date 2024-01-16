"use client";
import React from "react";
import clsx from "clsx";
import securityFormStyle from "./securityForm.module.scss";
import GenericInput from "@/components/common/GenericInput";
import PasswordValidationCondition from "./PasswordValidationCondition";
import GenericButton from "@/components/common/GenericButton";
import { Output, minLength, object, string } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
import { getCipherEncryptedText } from "@/utils/helper";
import { changePassword } from "@/services/MyProfileService";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import useTranslation from "@/hooks/useTranslation";
import CustomLoader from "@/components/common/CustomLoader";
import { securityTranslateType } from "@/translations/securityTranslate/en";

function SecurityForm() {
  const dispatch = useAppDispatch();
  const {
    loading,
    translate,
  }: { loading: boolean; translate: securityTranslateType | undefined } =
    useTranslation("securityTranslate");
  const router = useRouter();
  const schema = object({
    currentPassword: string(translate?.errorMsg?.currentPassword?.requireError, [
      minLength(1, translate?.errorMsg?.currentPassword?.requireError),
    ]),
    newPassword: string(translate?.errorMsg?.newPassword?.requireError, [
      minLength(1, translate?.errorMsg?.newPassword?.requireError),
      minLength(8, translate?.errorMsg?.newPassword?.requireError),
    ]),
    confirmPass: string(translate?.errorMsg?.confirmPass?.requireError, [
      minLength(1, translate?.errorMsg?.confirmPass?.requireError),
      minLength(8, translate?.errorMsg?.confirmPass?.compareError),
    ]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(schema);

  const onSubmit = async (data: Output<typeof schema>) => {
    console.log("password::", data);
    let payload;
    const encryptedCurrPass = getCipherEncryptedText(data.currentPassword);
    const encryptedNewPass = getCipherEncryptedText(data.newPassword);
    if (encryptedCurrPass && encryptedNewPass) {
      payload = {
        oldPassword: btoa(encryptedCurrPass),
        newPassword: btoa(encryptedNewPass),
      };
    }
    const resp: any = await changePassword(payload);
    if (resp.status === 200) {
      dispatch(
        addNotification({
          message: resp?.message,
          id: "password-update",
          status: "success",
        })
      );
      if (
        localStorage.getItem("forgotPassword") === "false" &&
        localStorage.getItem("securityQuestionsExists") === "false"
      ) {
        router.replace("/security-question");
      } else {
        router.replace("/adjuster-dashboard");
      }
    } else if (resp?.errorMessage) {
      dispatch(
        addNotification({
          message: resp?.errorMessage,
          id: "password-update",
          status: "error",
        })
      );
    }
  };

  if (loading) {
    return (
      <div
        className={clsx({
          "col-12": true,
          "d-flex": true,
          "flex-column": true,
          "position-relative": true,
        })}
      >
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx({
        "col-12": true,
        "d-flex": true,
        "flex-column": true,
      })}
    >
      <div
        className={clsx({
          [securityFormStyle.securityFormContainer]: true,
        })}
      >
        <div>{translate?.subHeading}</div>
        <div className={securityFormStyle.formGroup}>
          <GenericInput
            formControlClassname={clsx({
              [securityFormStyle.formControl]: true,
            })}
            inputFieldClassname={securityFormStyle.inputFieldClassname}
            label={translate?.inputFields?.currentPwd?.label}
            id="currentPassword"
            type="password"
            placeholder={translate?.inputFields?.currentPwd?.placeholder}
            errorMsg={errors?.currentPassword?.message}
            showError={errors["currentPassword"]}
            {...register("currentPassword")}
          />
          <PasswordValidationCondition translate={translate} />
          <GenericInput
            formControlClassname={clsx({
              [securityFormStyle.formControl]: true,
            })}
            inputFieldClassname={securityFormStyle.inputFieldClassname}
            label={translate?.inputFields?.newPwd?.label}
            id="newPassword"
            type="password"
            placeholder={translate?.inputFields?.newPwd?.placeholder}
            errorMsg={errors?.newPassword?.message}
            showError={!errors["currentPassword"] && errors["newPassword"]}
            {...register("newPassword")}
          />
          <GenericInput
            formControlClassname={clsx({
              [securityFormStyle.formControl]: true,
            })}
            inputFieldClassname={securityFormStyle.inputFieldClassname}
            label={translate?.inputFields?.confirmPwd?.label}
            id="confirmPass"
            type="password"
            placeholder={translate?.inputFields?.confirmPwd?.placeholder}
            errorMsg={errors?.confirmPass?.message}
            showError={
              !errors["currentPassword"] &&
              !errors["newPassword"] &&
              errors["confirmPass"]
            }
            {...register("confirmPass")}
          />
        </div>
      </div>
      <GenericButton
        btnClassname="mt-2 ms-auto w-fit"
        label={translate?.inputFields?.submitBtn?.label ?? ""}
        // theme="normal"
        type="submit"
      />
    </form>
  );
}

export default SecurityForm;
