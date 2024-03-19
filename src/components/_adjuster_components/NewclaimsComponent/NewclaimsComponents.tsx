"use client";
import React, { useState } from "react";
import Cards from "@/components/common/Cards";
import { object, string, minLength, number, nullish, any } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
import NewClaimsStyle from "./newClaimStyle.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import AddItemsComponent from "./AddItemsComponent";
import dynamic from "next/dynamic";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";
import GenericButton from "@/components/common/GenericButton";
import NewClaimWizardFormArrow from "./NewClaimWizardFormArrow/NewClaimWizardFormArrow";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import {
  creatClaim,
  hardDelteClaim,
  postClaim,
  UpdatePolicyDetails,
} from "@/services/_adjuster_services/ClaimService";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxCustomHook";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { unknownObjectType } from "@/constants/customTypes";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { ConnectedProps, connect } from "react-redux";
import {
  selectActiveSection,
  setActiveSection,
} from "@/reducers/_adjuster_reducers/UploadCSV/navigationSlice";
import Loading from "@/app/[lang]/loading";
import selectInsuranceCompanyName from "@/reducers/Session/Selectors/selectInsuranceCompanyName";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import { updateClaimDetail } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/ClaimSnapShotService";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { newClaimTransalateProp } from "@/app/[lang]/(adjuster)/new-claim/page";
import { resetAddItemsTableData } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";

const AssignItemsComponent = dynamic(() => import("./AssignItemsComponent"), {
  loading: () => <Loading />,
});
const PolicyInformation = dynamic(() => import("./PolicyInformation/PolicyInformation"), {
  loading: () => <Loading />,
});
const ClaimInformation = dynamic(() => import("./ClaimInformation/ClaimInformation"), {
  loading: () => <Loading />,
});

const NewclaimsComponent: React.FC<connectorType> = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activeSection = useAppSelector(selectActiveSection);
  let insuranceCompany = useAppSelector(selectInsuranceCompanyName);
  const companyId = useAppSelector(selectCompanyId);
  const schema = object({
    // policy schema
    email: nullish(string()),
    firstname: string("Invalid firstname", [
      minLength(1, "First name can contain only alphabets."),
    ]),
    lastname: string("Invalid lastname", [
      minLength(1, "Last name can contain only alphabets."),
    ]),
    zipcode: string("Invalid zipcode.", [minLength(1, "Enter zip code.")]),
    mobilenumber: nullish(string("mobile number")),
    secondaryPhonenumber: nullish(string("secondary phone number")),
    address: nullish(string("Address")),
    address1: nullish(string("Address one")),
    address2: nullish(string("Address two")),
    state: object(
      {
        state: string("state"),
        id: number("id"),
      },
      "Select a state"
    ),
    // claim schema
    claim: string("Please enter claim number.", [
      minLength(1, "Please enter the claim number."),
    ]),

    claimDate: any(),
    insuranceCompany: string("Invalid insurance company", [
      minLength(1, "Please enter value"),
    ]),
    adjusterName: string("Invalid adjuster name", [minLength(1, "Please enter value")]),
    lossType: any(),
    claimDescription: nullish(string("Invalid claim description")),
    claimDeductible: string("Please enter deductible.", [
      minLength(1, "Please enter deductible."),
    ]),
    minItemPrice: string("Please enter the minimum valueof item to price", [
      minLength(1, "Please enter the minimum valueof item to price"),
    ]),
    taxRate: string("Please enter tax rate.", [minLength(1, "Please enter tax rate.")]),
    contentLimits: string("Policy limit is required.", [
      minLength(1, "Policy limit is required."),
    ]),
    homeOwnersPolicyType: nullish(
      object(
        {
          id: number("id"),
          typeName: string("typeName"),
        },
        "Select Policy Type"
      )
    ),
  });

  const { translate } =
    useContext<TranslateContextData<newClaimTransalateProp>>(TranslateContext);

  const {
    register,
    handleSubmit,
    formState,
    control,
    resetField,
    setValue,
    reset,
    setError,
    clearErrors,
    getValues,
  } = useCustomForm(schema);
  const { errors } = formState;

  const [showResetConfirmation, setResetConfirmation] = useState(false);
  const [homeOwnerType, setHomeOwnerType] = useState<unknownObjectType>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [policyDetails, setPolicyDetails] = useState<any>({});
  const [claimId, setClaimId] = useState<any>();
  const [claimNumber, setClaimNumber] = useState<any>();
  const [applytax, setApplyTax] = useState("yes");
  const [policyDetailsRes, setPolicyDetailsRes] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [showDeleteConfirmation, setDeleteConfirmation] = useState<boolean>();

  const updateHomeOwnerType = (data: []) => {
    setHomeOwnerType(data);
  };

  const deleteClaim = async () => {
    const res = await hardDelteClaim({ claimNumber: claimNumber });
    if (res.status === 200) {
      dispatch(
        addNotification({
          message: "Claim Deleted successfully",
          id: "new_claim_delete_success",
          status: "success",
        })
      );
      router.push("/adjuster-dashboard");
    } else if (res?.status === 400) {
      dispatch(
        addNotification({
          message: res?.message,
          id: "new_claim_delete_success",
          status: "warning",
        })
      );
    } else {
      dispatch(
        addNotification({
          message: res?.errorMessage,
          id: "new_claim_delete_success",
          status: "error",
        })
      );
    }
  };
  const updateForm = async (data: any) => {
    const payload = {
      companyId: companyId,
      homeOwnerPolicyTypeId: data.homeOwnersPolicyType?.id,
      insuranceAccountDetails: {
        insuranceAccountNumber: policyDetailsRes?.insuranceNumber,
        id: policyDetailsRes?.insuraceAccountDetails?.id,
      },
      policyHolder: {
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        eveningTimePhone: data.secondaryPhonenumber,
        cellPhone: data.mobilenumber,
        dayTimePhone: data.secondaryPhonenumber,
        address: {
          streetAddressOne: data.address,
          streetAddressTwo: data.address1,
          city: data.address2,
          state: { id: data.state.id },
          zipcode: data.zipcode,
        },
        policyHolderId: policyDetailsRes?.policyHolder?.policyHolderId,
      },
      policyName: "testPolicyName",
      policyNumber: policyDetailsRes?.policyNumber,
      policyId: policyDetailsRes?.id,
      policyType: "Property",
    };

    const contentLimitInteger = data.contentLimits.replace("$", "").replaceAll(",", "");
    const claimDeductibleInteger = data.claimDeductible.replace("$", "");
    const minItemPriceInteger = data.minItemPrice.replace("$", "");

    const updateClaimPayload = {
      claimId: claimId,
      oldClaimNumber: data.claim,
      updatedClaimNumber: data.claim,
      policyNumber: policyDetailsRes?.policyNumber,
      claimType: policyDetailsRes?.claimType,
      applyTax: applytax === "yes" ? true : false,
      taxRate: Number(data.taxRate),
      damageTypeId: data.lossType?.id ?? 9,
      deductible: parseFloat(claimDeductibleInteger),
      additionalNote: null,
      incidentDate: dayjs(data.claimDate).format("YYYY-MM-DDTHH:mm:ssZ[Z]"),
      description: null,
      isACV: true,
      isRCV: false,
      branchId: "null",
      policyCategoryCoverages: policyDetails?.selectedCategory,
      individualLimit: null,
      shippingDate: null,
      shippingMethod: null,
      noOfItems: 0,
      minimumThreshold: parseFloat(minItemPriceInteger),
      thirdPartyInsCompName: data.insuranceCompany,
      thirdPartyInsAdjName: data.adjusterName,
      aggigateLimit: parseFloat(contentLimitInteger),
      claimProfile: process.env.NEXT_PUBLIC_CLAIM_PROFILE,
    };

    const postlCaimRes = await UpdatePolicyDetails(payload);
    if (postlCaimRes?.status === 200) {
      const creatClaimRes = await updateClaimDetail(updateClaimPayload);
      if (creatClaimRes?.status === 200) {
        setIsLoading(false);
        sessionStorage.setItem("claimNumber", creatClaimRes.data?.claimNumber);
        sessionStorage.setItem("claimId", creatClaimRes.data?.claimId);
        sessionStorage.setItem("redirectToNewClaimPage", "true");
        sessionStorage.setItem("applyTax", creatClaimRes.data?.applyTax);

        const nextSection = activeSection + 1;
        dispatch(setActiveSection(nextSection));
        dispatch(resetAddItemsTableData());

        dispatch(
          addNotification({
            message: creatClaimRes.message,
            id: "create_claim_success",
            status: "success",
          })
        );
      } else {
        setIsLoading(false);
        dispatch(
          addNotification({
            message: creatClaimRes.message ?? "Something went wrong.",
            id: "create_claim_failure",
            status: "error",
          })
        );
      }
    } else {
      setIsLoading(false);
      dispatch(
        addNotification({
          message: postlCaimRes.message ?? "Something went wrong.",
          id: "new_claim_failure",
          status: "error",
        })
      );
    }
  };
  const formSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      let PolicyInitials = "";
      let InsuranceCompanyIntials = "";
      let PolicyNumber = " ";
      let CustAccNumber = " ";
      const CurrentDate = dayjs().format("MMDDYYYYHHmm");
      if (data.firstname !== null && data.lastname !== null) {
        PolicyInitials = data.firstname.charAt(0) + "" + data.lastname.charAt(0);
      }
      insuranceCompany = insuranceCompany.trim();
      const spaceIndex = insuranceCompany.indexOf(" "); //Checking for spaces in Company name string

      if (insuranceCompany !== null) {
        if (spaceIndex === -1) {
          InsuranceCompanyIntials =
            insuranceCompany.charAt(0) + "" + insuranceCompany.charAt();

          if (PolicyInitials.length > 0 && InsuranceCompanyIntials.length > 0) {
            PolicyNumber =
              "PL" +
              "" +
              InsuranceCompanyIntials.toUpperCase() +
              "" +
              PolicyInitials.toUpperCase() +
              "" +
              CurrentDate;
            CustAccNumber =
              "CA" +
              "" +
              InsuranceCompanyIntials.toUpperCase() +
              "" +
              PolicyInitials.toUpperCase() +
              "" +
              CurrentDate;
          }
        } else {
          InsuranceCompanyIntials =
            insuranceCompany.length > 1
              ? insuranceCompany.slice(0, 2)
              : insuranceCompany[0] + insuranceCompany[0];
          PolicyNumber =
            "PL" +
            "" +
            InsuranceCompanyIntials.toUpperCase() +
            "" +
            PolicyInitials.toUpperCase() +
            "" +
            CurrentDate;
          CustAccNumber =
            "CA" +
            "" +
            InsuranceCompanyIntials.toUpperCase() +
            "" +
            PolicyInitials.toUpperCase() +
            "" +
            CurrentDate;
        }
      }

      const contentLimitInteger = data.contentLimits.replace("$", "").replaceAll(",", "");
      const claimDeductibleInteger = data.claimDeductible.replace("$", "");
      const minItemPriceInteger = data.minItemPrice.replace("$", "");
      const payload = {
        claimNumber: data.claim,
        additionalNote: "This is additional note for claim",
        companyId: companyId,
        description: "Test",
        homeOwnerPolicyTypeId: data.homeOwnersPolicyType?.id,
        insuranceAccountDetails: {
          insuranceAccountNumber: CustAccNumber,
        },
        policyHolder: {
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          eveningTimePhone: data.secondaryPhonenumber,
          cellPhone: data.mobilenumber,
          dayTimePhone: data.secondaryPhonenumber,
          address: {
            streetAddressOne: data.address,
            streetAddressTwo: data.address1,
            city: data.address2,
            state: { id: data.state.id },
            zipcode: data.zipcode,
          },
        },
        policyName: null,
        policyNumber: PolicyNumber,
        policyType: "HOME",
        propertyCoverage: policyDetails?.propertyCoverage ?? null,
        totalPolicyCoverage: policyDetails?.totalCoverage ?? null,
        totalSpecialLimit: policyDetails?.totalSpecialLimit ?? 0,
        policyLimits: parseFloat(contentLimitInteger),
        claimProfile: process.env.NEXT_PUBLIC_CLAIM_PROFILE,
      };

      const createClaimPayload = {
        filesDetails: null,
        file: null,
        claimDetails: {
          claimNumber: data.claim,
          policyNumber: PolicyNumber,
          claimType: "HOME",
          applyTax: applytax === "yes" ? true : false,
          taxRate: Number(data.taxRate),
          damageTypeId: data.lossType?.id ?? 9,
          deductible: parseFloat(claimDeductibleInteger),
          additionalNote: null,
          incidentDate: dayjs(data.claimDate).format("YYYY-MM-DDTHH:mm:ssZ[Z]"),
          description: null,
          isACV: true,
          isRCV: false,
          branchId: "null",
          policyCategoryCoverages: policyDetails.selectedCategory,
          individualLimit: null,
          shippingDate: null,
          shippingMethod: null,
          noOfItems: 0,
          minimumThreshold: parseFloat(minItemPriceInteger),
          thirdPartyInsCompName: data.insuranceCompany,
          thirdPartyInsAdjName: data.adjusterName,
          aggigateLimit: parseFloat(contentLimitInteger),
          claimProfile: process.env.NEXT_PUBLIC_CLAIM_PROFILE,
        },
      };
      const formData = new FormData();
      if (selectedFile.length > 0) {
        formData.append("filesDetails", JSON.stringify(docs));
        selectedFile.map((file: any) => {
          formData.append("file", file);
        });
      }
      formData.append("claimDetails", JSON.stringify(createClaimPayload.claimDetails));
      const postlCaimRes = await postClaim(payload);
      if (postlCaimRes?.status === 200) {
        setPolicyDetailsRes(postlCaimRes?.data);

        const creatClaimRes = await creatClaim(formData);
        if (creatClaimRes?.status === 200) {
          setIsLoading(false);
          setClaimId(creatClaimRes.data?.claimId);
          setClaimNumber(creatClaimRes.data?.claimNumber);
          sessionStorage.setItem("claimNumber", creatClaimRes.data?.claimNumber);
          sessionStorage.setItem("claimId", creatClaimRes.data?.claimId);
          sessionStorage.setItem("redirectToNewClaimPage", "true");
          sessionStorage.setItem("applyTax", creatClaimRes.data?.applyTax);
          const nextSection = activeSection + 1;
          dispatch(setActiveSection(nextSection));
          dispatch(resetAddItemsTableData());
          dispatch(addClaimContentListData({ claimContentData: [], claimId }));

          dispatch(
            addNotification({
              message: creatClaimRes.message,
              id: "create_claim_success",
              status: "success",
            })
          );
        } else {
          setIsLoading(false);
          dispatch(
            addNotification({
              message: creatClaimRes.message ?? "Something went wrong.",
              id: "create_claim_failure",
              status: "error",
            })
          );
        }
      } else {
        setIsLoading(false);
        dispatch(
          addNotification({
            message: postlCaimRes.message ?? "Something went wrong.",
            id: "new_claim_failure",
            status: "error",
          })
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting", error);
    }
  };
  const showConfirmation = () => {
    setResetConfirmation(true);
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmation(true);
  };
  const handleCloseDelete = () => {
    setDeleteConfirmation(false);
  };
  const handleSectionClick = (index: number, isArrowClick: boolean = false) => {
    if (!isArrowClick) {
      dispatch(setActiveSection(index));
    }
  };

  const handleAssignItemsClick = () => {
    dispatch(setActiveSection(2));
  };

  const handlePreviousClick = () => {
    const prevSection = activeSection - 1;
    dispatch(setActiveSection(prevSection));
    dispatch(resetAddItemsTableData());
  };

  const handleClose = () => {
    setResetConfirmation(false);
  };

  const handleReset = () => {
    reset();
    location.reload();
    handleClose();
  };
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
    // <>
    //   <ClaimInformation />
    //   <PolicyInformation />
    // </>;
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="mb-3">
        <NewClaimWizardFormArrow
          activeSection={activeSection}
          handleSectionClick={() => handleSectionClick(activeSection)}
        />
      </div>
      {activeSection === 0 && (
        <Cards className={NewClaimsStyle.cards}>
          <form
            onSubmit={handleSubmit(claimId ? updateForm : formSubmit)}
            encType="multipart/form-data"
          >
            <div className={NewClaimsStyle.informationTab}>
              <p className={NewClaimsStyle.claimText}>
                {" "}
                {translate?.newClaimTransalate?.newClaim?.claimPOlicyHeading}{" "}
              </p>
            </div>
            <div className={`row justify-content-end mt-4 ${NewClaimsStyle.upButtons}`}>
              <div className="col-auto p-0">
                <GenericButton
                  label={translate?.newClaimTransalate?.newClaim?.cancel}
                  theme="linkBtn"
                  size="medium"
                  onClick={() => router.push("/adjuster-dashboard")}
                />
              </div>
              <div className="col-auto ml-2 p-0">
                {policyDetailsRes?.policyNumber ? (
                  <GenericButton
                    label={translate?.newClaimTransalate?.newClaim?.deleteClaim}
                    theme="normal"
                    type="submit"
                    size="medium"
                    onClick={handleDeleteConfirmation}
                    btnClassname="me-2"
                  />
                ) : (
                  <GenericButton
                    label={translate?.newClaimTransalate?.newClaim?.resetAll}
                    theme="linkBtn"
                    size="medium"
                    onClick={showConfirmation}
                  />
                )}
              </div>
              <div className="col-auto ps-0">
                <GenericButton
                  label={translate?.newClaimTransalate?.newClaim?.saveNext}
                  theme="normal"
                  type="submit"
                  size="medium"
                />
              </div>
            </div>{" "}
            <div>
              <GenericComponentHeading
                title={translate?.newClaimTransalate?.newClaim?.policyholderInformation}
                customHeadingClassname={NewClaimsStyle.PolicyholderText}
                customTitleClassname={NewClaimsStyle.customTitleClassname}
              />
              <PolicyInformation
                register={register}
                error={errors}
                control={control}
                setValue={setValue}
                updateHomeOwnerType={updateHomeOwnerType}
                resetField={resetField}
                getValues={getValues}
                clearErrors={clearErrors}
                setError={setError}
                policyNumber={policyDetailsRes?.policyNumber}
              />
            </div>
            <div>
              <GenericComponentHeading
                title={translate?.newClaimTransalate?.newClaim?.claimInformarion}
                customHeadingClassname={NewClaimsStyle.PolicyholderText}
                customTitleClassname={NewClaimsStyle.customTitleClassname}
              />
              <ClaimInformation
                control={control}
                register={register}
                error={errors}
                setError={setError}
                clearErrors={clearErrors}
                homeOwnerTypeOptions={homeOwnerType}
                getValues={getValues}
                setValue={setValue}
                updateHomeOwnerType={updateHomeOwnerType}
                resetField={resetField}
                setPolicyDetails={setPolicyDetails}
                applytax={applytax}
                setApplyTax={setApplyTax}
                policyNumber={policyDetailsRes?.policyNumber}
                setSelectedFile={setSelectedFile}
                setDocs={setDocs}
                docs={docs}
                translate={translate}
              />
            </div>
            <div className={`row justify-content-end ${NewClaimsStyle.downButtons}`}>
              <div className="col-auto mt-2 p-0">
                <GenericButton
                  label={translate?.newClaimTransalate?.newClaim?.cancel}
                  theme="linkBtn"
                  size="medium"
                  onClick={() => router.push("/adjuster-dashboard")}
                />
              </div>
              <div className="col-auto mt-2 p-0">
                {policyDetailsRes?.policyNumber ? (
                  <GenericButton
                    label={translate?.newClaimTransalate?.newClaim?.deleteClaim}
                    theme="normal"
                    type="submit"
                    size="medium"
                    onClick={handleDeleteConfirmation}
                    btnClassname="me-2"
                  />
                ) : (
                  <GenericButton
                    label={translate?.newClaimTransalate?.newClaim?.resetAll}
                    theme="linkBtn"
                    size="medium"
                    onClick={showConfirmation}
                  />
                )}

                {showDeleteConfirmation && (
                  <div>
                    <ConfirmModal
                      showConfirmation={true}
                      closeHandler={handleCloseDelete}
                      submitBtnText="Yes"
                      closeBtnText="No"
                      childComp={`Are you sure want to delete claim # ${claimNumber}`}
                      modalHeading="Delete Claim"
                      submitHandler={deleteClaim}
                    />
                  </div>
                )}
                {showResetConfirmation && (
                  <div>
                    <ConfirmModal
                      showConfirmation={true}
                      closeHandler={handleClose}
                      submitBtnText="Yes"
                      closeBtnText="No"
                      childComp="Are you sure you want to discard the entered claim information?"
                      modalHeading="Reset Information"
                      submitHandler={handleReset}
                    />
                  </div>
                )}
              </div>
              <div className="col-auto mt-2 ps-0">
                <GenericButton
                  label={translate?.newClaimTransalate?.newClaim?.saveNext}
                  theme="normal"
                  type="submit"
                  size="medium"
                />
              </div>
            </div>
          </form>
        </Cards>
      )}
      {activeSection === 1 && (
        <Cards>
          <AddItemsComponent
            onAssignItemsClick={handleAssignItemsClick}
            onNewClaimsClick={handlePreviousClick}
          />
        </Cards>
      )}
      {activeSection === 2 && (
        <Cards>
          <AssignItemsComponent onNewClaimsClick={handlePreviousClick} />
        </Cards>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeSection: state.navigation.activeSection,
});

const mapDispatchToProps = {
  selectActiveSection,
  setActiveSection,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(NewclaimsComponent);
