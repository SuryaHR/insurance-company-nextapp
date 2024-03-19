"use client";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { object, string, minLength, email, Output } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
// import GenericInput from "@/components/common/GenericInput";
import GenericButton from "@/components/common/GenericButton";
import loginFormStyle from "./loginForm.module.scss";
import { login } from "@/services/LoginService";
import { getCipherEncryptedText, logoutHandler } from "@/utils/helper";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { useRouter } from "next/navigation";
import { addSessionData, resetSessionState } from "@/reducers/Session/SessionSlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { getClientCookie } from "@/utils/utitlity";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { loginTranslatePropType } from "@/app/[lang]/(adjuster)/login/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";

function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { translate } =
    useContext<TranslateContextData<loginTranslatePropType>>(TranslateContext);

  const accessDenideFlag = getClientCookie("accessDenied");
  useEffect(() => {
    if (accessDenideFlag === "true") {
      dispatch(resetSessionState());
      logoutHandler();
      dispatch(
        addNotification({
          message: "Access denied",
          id: "access_denied",
          status: "error",
        })
      );
    }
  }, [accessDenideFlag, dispatch]);

  const schema = object({
    username: string("Your email must be a string.", [
      minLength(1, translate?.loginTranslate?.inputErrors?.userNameRequired),
      email(translate?.loginTranslate?.inputErrors?.invalidEmail),
    ]),
    password: string("Your password must be a string.", [
      minLength(1, translate?.loginTranslate?.inputErrors?.passwordRequired),
    ]),
  });

  const { register, handleSubmit, formState } = useCustomForm(schema);

  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: Output<typeof schema>) => {
    let payload;
    const username = getCipherEncryptedText(data.username);
    const password = getCipherEncryptedText(data.password);
    if (username && password) {
      payload = {
        captchCode: "",
        isHideCaptcha: process.env.NEXT_PUBLIC_HIDE_CAPTCHA?.toString(),
        username: btoa(username),
        password: btoa(password),
      };
    }
    const loginRes: any = await login(payload);
    dispatch(addSessionData(localStorage));
    if (loginRes.result.status === 200001) {
      if (localStorage.getItem("resetPassword") === "true") {
        router.push("/security");
      } else if (
        localStorage.getItem("forgotPassword") === "true" &&
        localStorage.getItem("securityQuestionsExists") == "false"
      ) {
        router.push("/security");
      } else if (
        localStorage.getItem("forgotPassword") === "true" &&
        localStorage.getItem("securityQuestionsExists") === "true"
      ) {
        router.push("/reset-password");
      } else if (
        localStorage.getItem("forgotPassword") === "false" &&
        localStorage.getItem("securityQuestionsExists") === "false" &&
        localStorage.getItem("resetPassword") === "false"
      ) {
        router.push("/security-question");
      } else {
        const homePageRoute = getClientCookie("homeScreen");
        if (homePageRoute) {
          router.push(homePageRoute);
        } else {
          router.push("/login");
        }
      }
    } else {
      dispatch(
        addNotification({
          message: loginRes?.result?.errorMessage,
          id: "login-error",
          status: "error",
        })
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={loginFormStyle.loginForm__form}>
        <GenericUseFormInput
          showError={errors["username"]}
          errorMsg={errors?.username?.message}
          placeholder={translate?.loginTranslate?.inputFields?.usernamePlaceholder}
          fieldSize="large"
          id="username"
          {...register("username")}
        />
        <GenericUseFormInput
          showError={!errors["username"] && errors["password"]}
          errorMsg={errors?.password?.message}
          placeholder={translate?.loginTranslate?.inputFields?.passwordPlaceholder}
          fieldSize="large"
          type="password"
          id="password"
          {...register("password")}
        />
        <GenericButton
          label={translate?.loginTranslate?.inputFields?.submitBtn}
          type="submit"
          theme="lightBlue"
          isSubmitting={isSubmitting}
        />
        <Link className={loginFormStyle.link} href="/forgot-password">
          {translate?.loginTranslate?.forgotPasswordLink}
        </Link>
        {process.env.NEXT_PUBLIC_LOGIN_WITH_SSO == "true" && (
          <GenericButton
            label={translate?.loginTranslate?.inputFields?.ssoBtn}
            theme="darkBlue"
          />
        )}
      </form>
    </>
  );
}

export default LoginForm;
