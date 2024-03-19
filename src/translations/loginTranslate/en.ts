const translate = {
  welcomeMsg: "Welcome back!",
  forgotPasswordLink: "Forgot Your Password?",
  inputFields: {
    submitBtn: "Login",
    usernamePlaceholder: "Username or Agencycode",
    passwordPlaceholder: "Password",
    ssoBtn: "Sign in with SSO",
  },
  inputErrors: {
    userNameRequired: "User name field is required.",
    invalidEmail: "Please enter valid email.",
    passwordRequired: "Password field is required.",
  },
};

export { translate };

export type loginTranslateType = typeof translate;
