"use client";
import React from "react";
import Link from "next/link";
import GenericButton from "@/components/common/GenericButton";
import fPWDFormStyle from "./forgotPasswordForm.module.scss";
import GenericInput from "@/components/common/GenericInput";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, email, minLength, object, string } from "valibot";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/ForgetpasswordService";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { forgotPwdTranslateType } from "@/translations/forgotPasswordTranslate/en";

function ForgotPasswordForm({ translate }: { translate: forgotPwdTranslateType }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const schema = object({
    email: string(translate?.errorMsg?.email?.required, [
      minLength(1, translate?.errorMsg?.email?.required),
      email(translate?.errorMsg?.email?.invalid),
    ]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(schema);

  const onSubmit = async (data: Output<typeof schema>) => {
    console.log("Data::;", data);
    // router.push("/security");
    const payload = {
      email: data.email,
      isHideCaptcha: process.env.NEXT_PUBLIC_HIDE_CAPTCHA,
    };
    const response: any = await forgotPassword(payload);
    if (response.result.status === 200) {
      const notifyPayload = {
        message: `An email has been sent to ${data.email} with details to reset password.`,
        id: "reset-email",
        status: "success",
      };
      dispatch(addNotification(notifyPayload));
      router.replace("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={fPWDFormStyle.root}>
      <GenericInput
        label={translate?.inputField?.label}
        placeholder={translate?.inputField?.placeholder}
        formControlClassname={fPWDFormStyle.formControl}
        inputFieldClassname={fPWDFormStyle.inputField}
        labelClassname={fPWDFormStyle.label}
        // theme="normal"
        showError={errors["email"]}
        errorMsg={errors?.email?.message}
        isFixedError={true}
        {...register("email")}
      />
      <div className={fPWDFormStyle.actionDiv}>
        <Link href="/login" className={fPWDFormStyle.backBtn}>
          {translate?.inputField?.backBtn}
        </Link>
        <GenericButton
          label={translate?.inputField?.submitBtn}
          // theme="normal"
          type="submit"
          btnClassname={fPWDFormStyle.resetBtn}
        />
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
