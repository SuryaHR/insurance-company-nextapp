"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import ResetPasswordComponentStyle from "./ResetPasswordComponent.module.scss";
import GenericInput from "@/components/common/GenericInput";
import GenericButton from "@/components/common/GenericButton";
import {
  getRandomQuestionsForUser,
  verifyAnswer,
} from "@/services/ForgetpasswordService";
import RandomQuestionComponent from "./RandomQuestionComponent";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { resetPasswordTranslateType } from "@/translations/resetPasswordTranslate/en";

interface FormData {
  answer: string;
}
function ResetPasswordComponent({
  translate,
}: {
  translate: resetPasswordTranslateType;
}) {
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
      console.log("resp", resp);
      if (resp?.result?.status === 200) {
        const { data } = resp.result;
        setQuestion(data.questionName);
        setQuestionId(data.id);
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    console.log("Form data submitted:", formData);
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
          label={translate?.inputFields?.qestionLabel}
        />
        <div className={ResetPasswordComponentStyle.answerContainer}>
          <label htmlFor="answer" className={ResetPasswordComponentStyle.label}>
            {translate?.inputFields?.answerLabel}
          </label>
          <GenericInput
            inputFieldClassname={ResetPasswordComponentStyle.inputFieldClassname}
            placeholder={translate?.inputFields?.answerPlaceholder}
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
        label={translate?.inputFields?.submitBtn}
        btnClassname={clsx("my-3", ResetPasswordComponentStyle.actionBtn)}
        type="submit"
        disabled={isButtonDisabled}
      />
    </form>
  );
}

export default ResetPasswordComponent;
