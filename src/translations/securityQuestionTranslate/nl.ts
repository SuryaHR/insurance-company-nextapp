const translate = {
  heading: "Security Questions",
  validatePoints: {
    points: [
      "* Select 3 security questions from the list and answer them.",
      "* These questions and answers will be needed when resetting you password.",
      "* Fields are marked with * symbol are mandatory.",
    ],
  },
  inputFields: {
    anwser: {
      label: "Answer",
      placeholder: "Enter answer",
    },
    question1: {
      label: "Question 1",
      placeholder: "Select Question 1",
    },
    question2: {
      label: "Question 2",
      placeholder: "Select Question 2",
    },
    question3: {
      label: "Question 3",
      placeholder: "Select Question 3",
    },
    submitBtn: "I'm ready",
  },
};

export { translate };

export type securityQuestionTranslateType = typeof translate;
