"use client";

import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import ResetPasswordComponentStyle from "./ResetPasswordComponent.module.scss";
import GenericButton from "@/components/common/GenericButton";
import {
  getRandomQuestionsForUser,
  verifyAnswer,
} from "@/services/_adjuster_services/ForgetpasswordService";
import RandomQuestionComponent from "./RandomQuestionComponent";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { resetPasswordTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/reset-password/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";

interface FormData {
  answer: string;
}
function ResetPasswordComponent() {
  const { translate } =
    useContext<TranslateContextData<resetPasswordTranslatePropType>>(TranslateContext);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>();

  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const resp: any = await getRandomQuestionsForUser(localStorage.getItem("userId"));
      if (resp?.result?.status === 200) {
        const { data } = resp.result;
        setQuestion(data.questionName);
        setQuestionId(data.id);
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const payload = {
      userId: localStorage.getItem("userId"),
      questionAnswerList: [
        {
          questionId: questionId,
          answer: formData.answer,
        },
      ],
    };
    const resp: any = await verifyAnswer(payload);
    if (resp.result.status === 200) {
      router.replace("/security");
    } else if (resp.result.errorMessage) {
      dispatch(
        addNotification({
          message: resp?.result?.errorMessage,
          id: "verify-answer",
          status: "error",
        })
      );
    }
  };

  const isButtonDisabled = answer.length === 0;

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (e.target.value.trim() === "") {
      setError("answer", {
        type: "manual",
        message: "Answer is required",
      });
    } else {
      clearErrors("answer");
    }
  };

  return (
    <form
      className="col-lg-4 col-md-6 col-12 d-flex flex-column"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={ResetPasswordComponentStyle.formContainer}>
        <RandomQuestionComponent
          question={question}
          label={translate?.resetPasswordTranslate?.inputFields?.qestionLabel}
        />
        <div className={ResetPasswordComponentStyle.answerContainer}>
          <label htmlFor="answer" className={ResetPasswordComponentStyle.label}>
            {translate?.resetPasswordTranslate?.inputFields?.answerLabel}
          </label>
          <GenericUseFormInput
            inputFieldClassname={ResetPasswordComponentStyle.inputFieldClassname}
            placeholder={
              translate?.resetPasswordTranslate?.inputFields?.answerPlaceholder
            }
            showError={errors.answer}
            errorMsg={errors.answer?.message}
            isFixedError={true}
            {...register("answer")}
            value={answer}
            onChange={handleAnswerChange}
          />
        </div>
      </div>
      <GenericButton
        label={translate?.resetPasswordTranslate?.inputFields?.submitBtn}
        btnClassname={clsx("my-3", ResetPasswordComponentStyle.actionBtn)}
        type="submit"
        disabled={isButtonDisabled}
      />
    </form>
  );
}

export default ResetPasswordComponent;
