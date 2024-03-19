"use client";
import React, { useContext, useState } from "react";
import clsx from "clsx";
import securityFormStyle from "./securityForm.module.scss";
import PasswordValidationCondition from "./PasswordValidationCondition";
import GenericButton from "@/components/common/GenericButton";
import { Output, minLength, object, string } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
import { getCipherEncryptedText } from "@/utils/helper";
import { changePassword } from "@/services/_adjuster_services/MyProfileService";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { securityTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/security/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import { isValidPassword } from "@/utils/utitlity";

function SecurityForm() {
  const dispatch = useAppDispatch();
  const { translate } =
    useContext<TranslateContextData<securityTranslatePropType>>(TranslateContext);
  const router = useRouter();
  const schema = object({
    currentPassword: string(
      translate?.securityTranslate?.errorMsg?.currentPassword?.requireError,
      [
        minLength(
          1,
          translate?.securityTranslate?.errorMsg?.currentPassword?.requireError
        ),
      ]
    ),
    newPassword: string(
      translate?.securityTranslate?.errorMsg?.newPassword?.requireError,
      [minLength(1, translate?.securityTranslate?.errorMsg?.newPassword?.requireError)]
    ),
    confirmPass: string(
      translate?.securityTranslate?.errorMsg?.confirmPass?.requireError,
      [minLength(1, translate?.securityTranslate?.errorMsg?.confirmPass?.requireError)]
    ),
  });

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    formState: { errors, isValid },
  } = useCustomForm(schema);

  const [pwdStrength, setPwdStrength] = useState({
    widthPercentage: 0,
    strength: "",
    backGround: "",
  });

  const onSubmit = async (data: Output<typeof schema>) => {
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

  const { onChange: currentPasswordChange, ...currentPasswordRest } =
    register("currentPassword");

  const { onChange: newPasswordChange, ...newPasswordRest } = register("newPassword");
  const { onChange: confirmPassChange, ...confirmPassRest } = register("confirmPass");

  const getPasswordStrength = (pass: string) => {
    const tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i];
    let widthPercentage = 0;
    let strength = "";
    let backGround = "";
    if (!pass) {
      widthPercentage = 0;
      strength = "Too Short";
    } else {
      let s = 0;
      if (pass.length < 6) {
        if (pass.length == 0) {
          widthPercentage = 0;
          strength = "Too Short";
        } else {
          strength = "Weak";
          widthPercentage = 25;
          backGround = "#e43a45";
          return {
            widthPercentage,
            strength,
            backGround,
          };
        }
      }
      for (const i in tests) {
        if (tests[i].test(pass)) s++;
      }
      switch (s) {
        case 1:
          strength = "Weak";
          widthPercentage = 25;
          backGround = "#e43a45";
          break;
        case 2:
          strength = "Fair";
          widthPercentage = 50;
          backGround = "#f4d03f";
          break;
        case 3:
          strength = "Good";
          widthPercentage = 75;
          backGround = "#32c5d2";
          break;
        case 4:
          strength = "Strong";
          widthPercentage = 100;
          backGround = "#1fb778";
          break;
        default:
          break;
      }
    }

    return { widthPercentage, strength, backGround };
  };

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
        <div>{translate?.securityTranslate?.subHeading}</div>
        <div className={securityFormStyle.formGroup}>
          <GenericUseFormInput
            formControlClassname={clsx({
              [securityFormStyle.formControl]: true,
            })}
            inputFieldClassname={securityFormStyle.inputFieldClassname}
            label={translate?.securityTranslate?.inputFields?.currentPwd?.label}
            id="currentPassword"
            type="password"
            placeholder={
              translate?.securityTranslate?.inputFields?.currentPwd?.placeholder
            }
            errorMsg={errors?.currentPassword?.message}
            showError={errors["currentPassword"]}
            {...currentPasswordRest}
            onChange={(e: React.FocusEvent<HTMLInputElement>) => {
              currentPasswordChange(e);
              const newPasswordValue = getValues("newPassword");
              if (
                newPasswordValue &&
                !errors.newPassword &&
                newPasswordValue === e.target.value
              ) {
                setError("newPassword", {
                  type: "manual",
                  message:
                    translate?.securityTranslate?.errorMsg?.newPassword
                      ?.samePasswordError,
                });
              } else if (errors["newPassword"]) {
                if (errors["newPassword"]?.type === "manual") {
                  clearErrors("newPassword");
                }
              }
            }}
          />
          <PasswordValidationCondition translate={translate} />
          <GenericUseFormInput
            formControlClassname={clsx({
              [securityFormStyle.formControl]: true,
            })}
            inputFieldClassname={securityFormStyle.inputFieldClassname}
            label={translate?.securityTranslate?.inputFields?.newPwd?.label}
            id="newPassword"
            type="password"
            placeholder={translate?.securityTranslate?.inputFields?.newPwd?.placeholder}
            errorMsg={errors?.newPassword?.message}
            showError={!errors["currentPassword"] && errors["newPassword"]}
            {...newPasswordRest}
            onChange={(e: React.FocusEvent<HTMLInputElement>) => {
              newPasswordChange(e);
              const currentPasswordValue = getValues("currentPassword");
              const confirmPassValue = getValues("confirmPass");

              // compare new password and current password
              if (e.target.value && !isValidPassword(e.target.value)) {
                setError("newPassword", {
                  type: "regex",
                  message:
                    translate?.securityTranslate?.errorMsg?.newPassword?.maxLimitError,
                });
              } else if (
                currentPasswordValue &&
                currentPasswordValue === e.target.value
              ) {
                setError("newPassword", {
                  type: "manual",
                  message:
                    translate?.securityTranslate?.errorMsg?.newPassword
                      ?.samePasswordError,
                });
              } else if (errors["newPassword"]) {
                if (["regex", "manual"].includes(errors["newPassword"]?.type)) {
                  clearErrors("newPassword");
                }
              }
              // compare new password and confirm password
              if (
                confirmPassValue &&
                e.target.value &&
                confirmPassValue !== e.target.value
              ) {
                setError("confirmPass", {
                  type: "manual",
                  message:
                    translate?.securityTranslate?.errorMsg?.confirmPass?.compareError,
                });
              } else if (
                errors["confirmPass"] &&
                errors["confirmPass"]?.type === "manual"
              ) {
                clearErrors("confirmPass");
              }
              setPwdStrength(() => getPasswordStrength(e.target.value));
            }}
          />
          {!errors["newPassword"] && getValues("newPassword") && (
            <div className={securityFormStyle.passwordStrengthWrapper}>
              <div className={securityFormStyle.secondDiv}>
                <div className={securityFormStyle.strengthDiv}>
                  <div
                    className={securityFormStyle.strengthBar}
                    style={{
                      width: `${pwdStrength.widthPercentage}%`,
                      backgroundColor: pwdStrength?.backGround,
                    }}
                  />
                </div>
                <span className="sbold">{pwdStrength?.strength}</span>
              </div>
            </div>
          )}
          <GenericUseFormInput
            formControlClassname={clsx({
              [securityFormStyle.formControl]: true,
            })}
            inputFieldClassname={securityFormStyle.inputFieldClassname}
            label={translate?.securityTranslate?.inputFields?.confirmPwd?.label}
            id="confirmPass"
            type="password"
            placeholder={
              translate?.securityTranslate?.inputFields?.confirmPwd?.placeholder
            }
            errorMsg={errors?.confirmPass?.message}
            showError={
              !errors["currentPassword"] &&
              !errors["newPassword"] &&
              errors["confirmPass"]
            }
            {...confirmPassRest}
            onChange={(e: React.FocusEvent<HTMLInputElement>) => {
              confirmPassChange(e);
              const newPasswordValue = getValues("newPassword");
              if (newPasswordValue && newPasswordValue !== e.target.value) {
                setError("confirmPass", {
                  type: "manual",
                  message:
                    translate?.securityTranslate?.errorMsg?.confirmPass?.compareError,
                });
              } else if (errors["confirmPass"]) {
                if (errors["confirmPass"]?.type === "manual") {
                  clearErrors("confirmPass");
                }
              }
            }}
          />
        </div>
      </div>
      <GenericButton
        btnClassname="mt-2 ms-auto w-fit"
        label={translate?.securityTranslate?.inputFields?.submitBtn?.label ?? ""}
        // theme="normal"
        disabled={!isValid || Object.keys(errors).length > 0}
        type="submit"
      />
    </form>
  );
}

export default SecurityForm;
