const translate = {
  heading: "Security",
  subHeading: "Password",

  inputFields: {
    currentPwd: {
      label: "Current password",
      placeholder: "Current Password",
    },
    newPwd: {
      label: "New password",
      placeholder: "New Password",
    },
    confirmPwd: {
      label: "Confirm Password",
      placeholder: "Confirm Password",
    },
    submitBtn: {
      label: "Change Password",
    },
  },

  validatePoints: {
    validateHeading: "New Password Requirement",
    points: [
      "* 8-16 character long",
      "* Should contain atleast one number and one special character",
      "* Should have a mixture of uppercase and lowercase letters",
    ],
  },

  errorMsg: {
    currentPassword: {
      requireError: "Please enter your current password",
    },
    newPassword: {
      requireError: "Please enter your new password.",
      maxLimitError: "The entered password does not meet the above requirements.",
    },
    confirmPass: {
      requireError: "Please confirm your new password.",
      compareError: "The entered password does not meet the above requirements.",
    },
  },
};

export { translate };

export type securityTranslateType = typeof translate;
