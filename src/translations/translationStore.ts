enum translatePage {
  loginTranslate = "loginTranslate",
  forgotPasswordTranslate = "forgotPasswordTranslate",
  securityTranslate = "securityTranslate",
  securityQuestionTranslate = "securityQuestionTranslate",
  resetPasswordTranslate = "resetPasswordTranslate",
  claimDocumentsTranslate = "claimDocumentsTranslate",
  adjusterPropertyClaimActivityLog = "adjusterPropertyClaimActivityLog",
  addItemModalTranslate = "addItemModalTranslate",
  claimDetailsTranslate = "claimDetailsTranslate",
  serviceRequestComponent = "serviceRequestComponent",
  contentListComponent = "contentListComponent",
  contentsEvaluationTranslate = "contentsEvaluationTranslate",
  claimDetailsTabTranslate = "claimDetailsTabTranslate",
}

export type translatePageType = keyof typeof translatePage;
export default translatePage;
