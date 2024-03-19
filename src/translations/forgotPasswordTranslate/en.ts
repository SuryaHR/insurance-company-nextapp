const translate = {
  heading: "Forgot Password?",
  subHeading:
    "Provide your email address and we'll send you link to reset your password.",
  inputField: {
    label: "Email Address",
    placeholder: "Enter email",
    backBtn: "Back to Login Page",
    submitBtn: "Reset",
  },
  errorMsg: {
    email: {
      invalid: "Please enter valid email.",
      required: "Email is required.",
    },
  },
};

export { translate };

export type forgotPwdTranslateType = typeof translate;
