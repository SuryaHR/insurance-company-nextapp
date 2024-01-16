import ClmainInfoStyle from "./ClaimInfo.module.scss";
import GenericInput from "@/components/common/GenericInput";
import { useForm, Controller } from "react-hook-form";
import GenericSelect from "@/components/common/GenericSelect";

const UpdateClaimInfoForm: React.FC = () => {
  const selectOptions = [
    {
      id: 1,
      name: "Water",
      active: true,
    },
    {
      id: 2,
      name: "Fire/Smoke",
      active: true,
    },
    {
      id: 3,
      name: "Lightning",
      active: true,
    },
    {
      id: 4,
      name: "Theft From Vehicle",
      active: true,
    },
    {
      id: 5,
      name: "Theft From Home",
      active: true,
    },
    {
      id: 6,
      name: "Mysterious Disappearance",
      active: true,
    },
    {
      id: 7,
      name: "Vandalism",
      active: true,
    },
    {
      id: 8,
      name: "Wind/Tornado/Hurricane/Hail",
      active: true,
    },
    {
      id: 9,
      name: "Not Specified",
      active: true,
    },
  ];

  const selectBoxStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      border: "1px solid #c2cad8",
      boxShadow: "none",
      "&:focus, &:active": {
        border: "1px solid #4169e1",
      },
      height: "22px",
      minHeight: "22px",
    }),
    valueContainer: (styles: any) => ({ ...styles, bottom: "1.3px" }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      padding: "1px",
      height: "22px",
      width: "15px",
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      padding: "1px",
      height: "22px",
      width: "15px",
    }),
    // ...customStyles,
  };

  //   type inputTypes = {
  //     claimId: string,
  //     updatedClaimNumber: string,
  //     oldClaimNumber: string,
  //     damageTypeId: number,
  //     taxRate: number,
  //     deductible: number,
  //     minimumThreshold: number,
  //     totalPolicyCoverage: number,
  //     policyLimit: number,
  //     individualLimit: any,
  //     isUpdatedByInsuranceUser: boolean,
  //     shippingDate: any,
  //     shippingMethod: any,
  //     additionalNote: any
  // }

  const defaultValues = {
    claimId: "Asdasdas",
    updatedClaimNumber: "Dwedwed",
    oldClaimNumber: "dwedwe",
    damageTypeId: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumSignificantDigits: 3,
    }).format(2),
    taxRate: 10,
    deductible: 2,
    minimumThreshold: 3,
    totalPolicyCoverage: 10000,
    policyLimit: 3000,
    individualLimit: null,
    isUpdatedByInsuranceUser: true,
    shippingDate: null,
    shippingMethod: null,
    additionalNote: null,
  };
  // const { register, handleSubmit, formState, setValue, control } = useCustomForm(schema);

  const { register, handleSubmit, setValue, control } = useForm({ defaultValues });
  // const onSubmit: SubmitHandler<inputTypes> = (data) => console.log(data)

  const submitHandler = async (data: any) => {
    console.log("Submit data", data);
  };

  return (
    <form id="claim-snapshot-form" onSubmit={handleSubmit(submitHandler)}>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Claim #
        </label>
        {/* <div className="col-md-3 col-sm-3 col-6">adjustereStatusWork</div> */}
        <div className="col-md-3 col-sm-3 col-6">
          {/* <GenericInput value={"FLOW4122023"} setValue={setValue} {...register("claimId")} inputFieldClassname={ClmainInfoStyle.customInput}/> */}
          <GenericInput
            setValue={setValue}
            {...register("updatedClaimNumber")}
            inputFieldClassname={ClmainInfoStyle.customInput}
          />
        </div>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Status
        </label>
        <div className="col-md-3 col-sm-3 col-6">Work In Progress</div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Created Date
        </label>
        <div className="col-md-3 col-sm-3 col-6">Dec 8, 2023 7:53 PM</div>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Elapsed Time
        </label>
        <div className="col-md-3 col-sm-3 col-6">2 d 19 h 9 m</div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Loss Type
        </label>
        {/* <div className="col-md-3 col-sm-3 col-6">Not Specified</div> */}
        <div className="col-md-3 col-sm-3 col-6">
          {/* <GenericInput {...register("damageTypeId")} inputFieldClassname={ClmainInfoStyle.customInput} /> */}
          <Controller
            control={control}
            name={"damageTypeId"}
            rules={{ required: true }}
            render={({ field: { ...rest } }: any) => (
              <GenericSelect
                // labelText={selectLabel}
                // placeholder={selectPlaceholder}
                customStyles={selectBoxStyles}
                isSearchable={false}
                options={selectOptions}
                // showError={errors[selectName]}
                // errorMsg={errors[selectName]?.message}
                getOptionLabel={(option: { name: any }) => option.name}
                getOptionValue={(option: { id: any }) => option.id}
                name={"selectOptions"}
                {...rest}
              />
            )}
          />
        </div>
        <label className={`col-md-3 col-sm-3 col-6 ps-1 ${ClmainInfoStyle.fieldLabel}`}>
          Claim Deductible
        </label>
        {/* <div className="col-md-3 col-sm-3 col-6">$11.00</div> */}
        <div className="col-md-3 col-sm-3 col-6">
          <GenericInput
            {...register("deductible")}
            inputFieldClassname={ClmainInfoStyle.customInput}
          />
        </div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Tax %
        </label>
        <div className="col-md-3 col-sm-3 col-6">
          <GenericInput
            {...register("taxRate")}
            inputFieldClassname={ClmainInfoStyle.customInput}
          />
        </div>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Content Limits
        </label>
        {/* <div className="col-md-3 col-sm-3 col-6">$11.00</div> */}
        <div className="col-md-3 col-sm-3 col-6">
          <GenericInput
            {...register("policyLimit")}
            inputFieldClassname={ClmainInfoStyle.customInput}
          />
        </div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          Min. $ Item to Price
        </label>
        {/* <div className="col-md-3 col-sm-3 col-6">$1.00</div>  */}
        <div className="col-md-3 col-sm-3 col-6">
          <GenericInput
            {...register("minimumThreshold")}
            inputFieldClassname={ClmainInfoStyle.customInput}
          />
        </div>
      </div>
    </form>
  );
};
export default UpdateClaimInfoForm;
