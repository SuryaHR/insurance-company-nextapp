import { getRoleBasedUrlList } from "./helper";

export const addLocalStorageData = (response: any) => {
  const { data } = response;
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("accessToken", data.token);
  localStorage.setItem("userName", data.email);
  localStorage.setItem("userLastName", data.lastName);
  localStorage.setItem("name", data.lastName + ", " + data.firstName);
  localStorage.setItem("office", data?.office);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("profilePicture", data?.displayPicture?.fileUrl);

  // for first time login, and forgot password flow
  localStorage.setItem("resetPassword", data?.resetPassword);
  localStorage.setItem("forgotPassword", data?.forgotPassword);
  localStorage.setItem("securityQuestionsExists", data?.securityQuestionsExists);

  const maxAge = 60 * 60 * 24 * 7; // 7 days

  // document.cookie = `resetPassword=${data?.resetPassword};max-age=${maxAge}`;
  // document.cookie = `forgotPassword=${data?.forgotPassword};max-age=${maxAge}`;
  // document.cookie = `securityQuestionsExists=${data?.securityQuestionsExists};max-age=${maxAge}`;
  document.cookie = `accessToken=${data?.token};max-age=${maxAge}`;
  document.cookie = `userId=${data?.userId};max-age=${maxAge}`;

  // const expiryDuration =  60 * 2;
  // document.cookie = `accessToken=${data?.token}; max-age=${expiryDuration}; path=/;`;

  if (data.branchDetails != null) {
    window.localStorage.setItem("branchCode", data.branchDetails.branchCode);
    window.localStorage.setItem("branchId", data.branchDetails.branchId);
  }
  if (
    data.companyDetails &&
    data.companyDetails !== null &&
    data.companyDetails !== undefined
  ) {
    window.localStorage.setItem("insuranceCompanyName", data.companyDetails.name);
  }

  //sessionStorage.setItem("Password", password);
  window.localStorage.setItem("userType", data.loggedinUserType);
  window.localStorage.setItem(
    "companyId",
    data.companyDetails ? data.companyDetails.id : ""
  );
  window.localStorage.setItem("CRN", data.companyDetails ? data.companyDetails.crn : "");
  if (data.vendorDetails !== null && data.vendorDetails !== undefined) {
    window.localStorage.setItem("vendorId", data.vendorDetails.vendorId);
  }
  // adding role based screen list to local storage
  if (data?.role?.length > 0) {
    window.localStorage.setItem("role", data?.role[0]?.roleName);
    document.cookie = `role=${data?.role[0]?.roleName};max-age=${maxAge}`;
    const screenList = getRoleBasedUrlList(data?.role[0]?.roleName);
    if (screenList) {
      document.cookie = `homeScreen=${screenList?.Home};max-age=${maxAge}`;
      window.localStorage.setItem("screenList", JSON.stringify(screenList?.Screens));
      window.localStorage.setItem("homeScreen", screenList?.Home);
    }
  }
};
