"use client";
import React, { useState } from "react";
import Cards from "../common/Cards/index";
import { object, email, string, minLength, number, any } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
import NewClaimsStyle from "./newClaimStyle.module.scss";
import GenericComponentHeading from "../common/GenericComponentHeading/index";
import PolicyInformation from "../PolicyInformation/PolicyInformation";
import ClaimInformation from "../ClaimInformation/ClaimInformation";
import AddItemsComponent from "./AddItemsComponent";
import dynamic from "next/dynamic";
import clsx from "clsx";
import ConfirmModal from "../common/ConfirmModal/ConfirmModal";
import GenericButton from "../common/GenericButton/index";
import NewClaimWizardFormArrow from "./NewClaimWizardFormArrow/NewClaimWizardFormArrow";
import { creatClaim, postClaim } from "@/services/ClaimService";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxCustomHook";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { unknownObjectType } from "@/constants/customTypes";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { ConnectedProps, connect } from "react-redux";
import { Suspense } from "react";
import {
  selectActiveSection,
  setActiveSection,
} from "@/reducers/UploadCSV/navigationSlice";
import Loading from "@/app/[lang]/loading";
import selectInsuranceCompanyName from "@/reducers/Session/Selectors/selectInsuranceCompanyName";

const AssignItemsComponent = dynamic(() => import("./AssignItemsComponent"), {
  loading: () => <Loading />,
});

const NewclaimsComponent: React.FC<connectorType> = () => {
  const dispatch = useAppDispatch();
  // const router = useRouter();
  const activeSection = useAppSelector(selectActiveSection);
  const insuranceCompany = useAppSelector(selectInsuranceCompanyName);

  console.log("insurancecompany", insuranceCompany);
  const schema = object({
    // policy schema
    firstname: string("firstname", [
      minLength(1, "First name can contain only alphabets."),
    ]),
    lastname: string("lastname", [minLength(1, "Last name can contain only alphabets.")]),
    zipcode: string("zipcode.", [minLength(1, "Enter zip code.")]),
    email: string("email", [email("Please enter valid email.")]),
    mobilenumber: string("mobile number"),
    secondaryPhonenumber: string("secondary phone number"),
    address: string("Address"),
    address1: string("Address one"),
    address2: string("Address two"),
    state: object({
      state: string("state"),
      id: number("id"),
    }),
    // claim schema
    claim: string("Claim", [minLength(1, "Please enter the claim number.")]),

    claimDate: any(),
    insuranceCompany: string("insurance company"),
    adjusterName: string("adjuster name"),
    claimDescription: string("claim description"),
    claimDeductible: string("claim deductible"),
    minItemPrice: string("Min Item Price", [
      minLength(1, "Please enter the minimum valueof item to price"),
    ]),
    taxRate: string("Tax Rate"),
    contentLimits: string("Content Limits", [minLength(1, "Policy number")]),
    lossType: any(),
    homeOwnersPolicyType: object({
      id: number("id"),
      typeName: string("typeName"),
    }),
  });

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
  console.log("logss", errors);

  const [show, setShow] = useState(false);
  const [homeOwnerType, setHomeOwnerType] = useState<unknownObjectType>([]);
  // const [claimNumberr, setClaimNumber] = useState<string | null>(null);

  const updateHomeOwnerType = (data: []) => {
    setHomeOwnerType(data);
    console.log("updateHomeOwnerType", data);
    console.log("homeOwnerType", homeOwnerType);
  };

  const formSubmit = async (data: any) => {
    try {
      console.log("data", data);
      let PolicyInitials = "";
      let InsuranceCompanyIntials = "";
      let PolicyNumber = " ";
      let CustAccNumber = " ";
      const CurrentDate = dayjs().format("MMDDYYYYHHmm");
      if (data.firstname !== null && data.lastname !== null) {
        PolicyInitials = data.firstname.charAt(0) + "" + data.lastname.charAt(0);
      }
      const abc = insuranceCompany.indexOf(" "); //Checking for spaces in Company name string
      console.log("abc", abc);

      if (insuranceCompany !== null) {
        if (abc == -1) {
          InsuranceCompanyIntials =
            insuranceCompany.charAt(0) + "" + insuranceCompany.charAt();
          console.log("InsuranceCompanyIntials", InsuranceCompanyIntials);

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
        }
      }
      console.log("namesss", PolicyNumber);
      console.log("CustAccNumber", CustAccNumber);
      const payload = {
        claimNumber: data.claim,
        additionalNote: "This is additional note for claim",
        companyId: "1",
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
            state: { id: 4 },
            zipcode: data.zipcode,
          },
        },
        policyName: null,
        policyNumber: PolicyNumber,
        policyType: "HOME",
        propertyCoverage: null,
        totalPolicyCoverage: null,
        totalSpecialLimit: 0,
        policyLimits: data.contentLimits,
      };
      console.log("payload", payload);
      const payload1 = {
        filesDetails: null,
        file: null,
        claimDetails: {
          claimNumber: data.claim,
          policyNumber: PolicyNumber,
          claimType: "HOME",
          applyTax: true,
          taxRate: data.taxRate,
          damageTypeId: data.lossType?.id ?? 9,
          deductible: data.claimDeductible,
          additionalNote: null,
          incidentDate: dayjs(data.claimDate).format("YYYY-MM-DDTHH:mm:ssZ[Z]"),
          description: null,
          isACV: true,
          isRCV: false,
          branchId: "null",
          policyCategoryCoverages: [
            {
              categoryId: homeOwnerType.categoryId,
              coverageLimit: homeOwnerType.coverageLimit,
              individualItemLimit: homeOwnerType.individualItemLimit,
            },
            {
              categoryId: homeOwnerType.categoryId,
              coverageLimit: homeOwnerType.coverageLimit,
              individualItemLimit: homeOwnerType.individualItemLimit,
            },
            {
              categoryId: homeOwnerType.categoryId,
              coverageLimit: homeOwnerType.coverageLimit,
              individualItemLimit: homeOwnerType.individualItemLimit,
            },
            {
              categoryId: homeOwnerType.categoryId,
              coverageLimit: homeOwnerType.coverageLimit,
              individualItemLimit: homeOwnerType.individualItemLimit,
            },
          ],
          individualLimit: null,
          shippingDate: null,
          shippingMethod: null,
          noOfItems: 0,
          minimumThreshold: data.minItemPrice,
          thirdPartyInsCompName: data.insuranceCompany,
          thirdPartyInsAdjName: data.adjusterName,
          aggigateLimit: data.contentLimits,
        },
      };
      const formData = new FormData();
      console.log(formData);
      formData.append("claimDetails", JSON.stringify(payload1.claimDetails));
      const postlCaimRes = await postClaim(payload);
      if (postlCaimRes?.status === 200) {
        dispatch(
          addNotification({
            message: "Successfully added item.",
            id: "new_claim_success",
            status: "success",
          })
        );
        const creatClaimRes = await creatClaim(formData);
        console.log("ccccccccc", creatClaimRes);
        if (creatClaimRes?.status === 200) {
          sessionStorage.setItem("claimNumber", creatClaimRes.data?.claimNumber);
          sessionStorage.setItem("claimId", creatClaimRes.data?.claimId);
          sessionStorage.setItem("redirectToNewClaimPage", "true");
          const nextSection = activeSection + 1;
          console.log("Next Section", nextSection);
          dispatch(setActiveSection(nextSection));
          dispatch(
            addNotification({
              message: creatClaimRes.message,
              id: "create_claim_success",
              status: "success",
            })
          );
        } else {
          dispatch(
            addNotification({
              message: creatClaimRes.message ?? "Something went wrong.",
              id: "create_claim_failure",
              status: "error",
            })
          );
        }
      } else {
        dispatch(
          addNotification({
            message: postlCaimRes.message ?? "Something went wrong.",
            id: "new_claim_failure",
            status: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error submitting", error);
    }
  };
  const showConfirmation = () => {
    setShow(true);
  };

  const handleSectionClick = (index: number, isArrowClick: boolean = false) => {
    if (!isArrowClick) {
      dispatch(setActiveSection(index));
    }
  };

  const handleAssignItemsClick = () => {
    dispatch(setActiveSection(2));
    // router.push("/new-claim");
  };

  const handlePreviousClick = () => {
    const prevSection = activeSection - 1;
    console.log("Form Data on Previous Click", getValues());
    dispatch(setActiveSection(prevSection));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleReset = () => {
    reset();
    handleClose();
  };
  return (
    <div>
      <div className="mb-3">
        <NewClaimWizardFormArrow
          activeSection={activeSection}
          handleSectionClick={() => handleSectionClick(activeSection)}
        />
      </div>
      {activeSection === 0 && (
        <Cards className={NewClaimsStyle.cards}>
          <form onSubmit={handleSubmit(formSubmit)} encType="multipart/form-data">
            <div className={NewClaimsStyle.informationTab}>
              <p className={NewClaimsStyle.claimText}>
                {" "}
                1) Claim and Policy Information{" "}
              </p>
            </div>
            <div
              className={clsx("row justify-content-end mt-4", NewClaimsStyle.upButtons)}
            >
              <div className="col-auto">
                <GenericButton
                  label="Cancel"
                  theme="normal"
                  size="medium"
                  onClick={showConfirmation}
                />
              </div>
              <div className="col-auto ml-2">
                <GenericButton
                  label="Reset"
                  theme="normal"
                  size="medium"
                  onClick={showConfirmation}
                />
              </div>
              <div className="col-auto">
                <GenericButton
                  label="Save & Next"
                  theme="normal"
                  type="submit"
                  size="medium"
                />
              </div>
            </div>{" "}
            <div>
              <GenericComponentHeading
                title={"Policyholder Information"}
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
              />
            </div>
            <div>
              <GenericComponentHeading
                title={"Claim Information"}
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
              />
            </div>
            <div className={clsx("row justify-content-end", NewClaimsStyle.downButtons)}>
              <div className="col-auto mt-2">
                <GenericButton
                  label="Cancel"
                  theme="normal"
                  size="medium"
                  onClick={showConfirmation}
                />
              </div>
              <div className="col-auto mt-2">
                <GenericButton
                  label="Reset"
                  theme="normal"
                  size="medium"
                  onClick={showConfirmation}
                />
                {show && (
                  <div>
                    <ConfirmModal
                      showConfirmation={true}
                      closeHandler={handleClose}
                      submitBtnText="Yes"
                      closeBtnText="No"
                      descText="Are you sure you want to discard the entered claim information?"
                      modalHeading="Reset Information"
                      submitHandler={handleReset}
                    />
                  </div>
                )}
              </div>
              <div className="col-auto mt-2">
                <GenericButton
                  label="Save & Next"
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
            // claimNumber={claimNumberr || ""}
          />
        </Cards>
      )}
      {activeSection === 2 && (
        <Suspense fallback={<Loading />}>
          <Cards>
            <AssignItemsComponent
              onNewClaimsClick={handlePreviousClick}
              // selectedRowsData={[]}
            />
          </Cards>
        </Suspense>
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
