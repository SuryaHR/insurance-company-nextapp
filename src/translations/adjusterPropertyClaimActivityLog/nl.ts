const translate = {
  heading: "Assignment Activity Log",
  buttons: {
    addActivity: "Add Activity",
    downloadAsPdf: "Download as PDF",
  },
  addActivityPopup: {
    heading: "New Activity",
    helpText:
      "The file should be jpg, jpeg, png, word, excel and pdf format and can upload to 20Mb file size.",
    addAttachment: "click to add attachment",
    inputField: {
      placeholder: "Description",
      title: "Description",
      error: "Please enter Activity description",
    },
    cancelBtn: "Cancel",
    submitBtn: "Publish Activity",
    fileSizeError: "File size exceeded. Please upload image below 20Mb",
    fileSupportError: "File type jpg ,jpeg ,png ,word ,excel ,pdf  is supported",
    fileSuccessfulUpload: "",
    fileErrorUpload: "Please try again",
  },
  activityLogView: {
    moreText: "More",
    lessText: "Less",
    docPreview: {
      downloadText: "Download",
      closeText: "Close Preview",
      fileTypeNotSupported:
        "File type does not support preview option. File will start downloading...",
    },
  },
};

export { translate };

export type adjusterPropertyClaimActivityLogType = typeof translate;
