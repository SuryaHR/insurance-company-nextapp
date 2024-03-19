"use client";
import ClmainInfoStyle from "./ClaimInfo.module.scss";
// import GenericInput from "@/components/common/GenericInput";
import { useForm, Controller } from "react-hook-form";
import GenericSelect from "@/components/common/GenericSelect";
import { convertToCurrentTimezone } from "@/utils/helper";
import {
  getLossTypes,
  updateClaimDetail,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/ClaimSnapShotService";
import { useContext, useEffect, useMemo, useState } from "react";
import Loading from "@/app/[lang]/loading";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { getclaimContents } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addContents } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import { serviceRequestList } from "@/services/_adjuster_services/ClaimServiceRequestListService";
import { addserviceRequestData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimServiceRequestSlice";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericPercentFormat from "@/components/common/GenericInput/GenericPercentFormat";
import GenericCurrencyFormat from "@/components/common/GenericInput/GenericCurrencyFormat";
interface UpdateClaimInfoType {
  claimSnapShotData: any;
  setShowForm: (arg0: boolean) => void;
}

const UpdateClaimInfoForm: React.FC<UpdateClaimInfoType> = ({
  claimSnapShotData,
  setShowForm,
}) => {
  const [selectOptions, setSelectOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const dispatch = useAppDispatch();
  const dateFormate = "MMM DD, YYYY h:mm A";
  useEffect(() => {
    const fetchLossType = async () => {
      setIsLoading(true);
      const lossTypeRes = await getLossTypes();
      setSelectOptions(lossTypeRes?.data);
      setIsLoading(false);
    };
    fetchLossType();
  }, []);

  const selectBoxStyles = {
    control: {
      boxShadow: "none",
      "&:focus, &:active": {
        border: "none",
      },
      border: "none",
      height: "16.67px",
      minHeight: "16.67px",
      bottom: "1.5px",
      paddingLeft: 0,
      paddingTop: 0,
    },
    singleValue: {
      fontSize: "12px",
      marginLeft: 0,
    },
    dropdownIndicator: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    indicatorSeparator: {
      display: "none",
    },
    clearIndicator: {
      display: "none",
    },
  };

  const fetchClaimContents = async () => {
    const claimId = claimSnapShotData?.claimId;
    const serviceListRes = await serviceRequestList({ claimId }, true);
    setShowForm(false);
    if (serviceListRes?.status === 200) {
      dispatch(addserviceRequestData({ claimServiceRequestList: serviceListRes }));
    }
    const claimContentRes = await getclaimContents({ claimId }, true);
    if (claimContentRes?.status === 200) {
      dispatch(addContents(claimContentRes?.data));
    }
    setIsLoading(false);
  };

  const defaultValues = {
    claimId: claimSnapShotData?.claimId,
    updatedClaimNumber: claimSnapShotData?.claimNumber,
    oldClaimNumber: claimSnapShotData?.claimNumber,
    damageTypeId: {
      name: claimSnapShotData?.damageType,
      id: claimSnapShotData?.damageTypeId,
    },
    taxRate: claimSnapShotData?.taxRate,
    deductible: claimSnapShotData?.deductible,
    minimumThreshold: claimSnapShotData?.minimumThreshold,
    totalPolicyCoverage: claimSnapShotData?.policyLimit,
    policyLimit: claimSnapShotData?.policyLimit,
    individualLimit: claimSnapShotData?.individualLimit,
    isUpdatedByInsuranceUser: true,
    shippingDate: null,
    shippingMethod: null,
    additionalNote: claimSnapShotData?.additionalNote,
  };

  const { register, handleSubmit, control, setValue } = useForm({ defaultValues });

  useMemo(() => {
    setValue("damageTypeId", {
      name: claimSnapShotData?.damageType,
      id: claimSnapShotData?.damageTypeId,
    });
  }, [claimSnapShotData?.damageType, claimSnapShotData?.damageTypeId, setValue]);

  const submitHandler = async (data: any) => {
    setIsLoading(true);
    const payload = {
      ...data,
      damageTypeId: data?.damageTypeId?.id,
      claimProfile: "Contents",
    };
    const updateClaimDetailRes = await updateClaimDetail(payload);
    if (updateClaimDetailRes?.status === 200) {
      fetchClaimContents();
      setIsLoading(false);
      dispatch(
        addNotification({
          message: updateClaimDetailRes?.message,
          id: "updateClaimDetail-success",
          status: "success",
        })
      );
    } else {
      setIsLoading(false);
      dispatch(
        addNotification({
          message: updateClaimDetailRes?.message,
          id: "updateClaimDetail-success",
          status: "success",
        })
      );
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <form id="claim-info-update-form" onSubmit={handleSubmit(submitHandler)}>
        <div
          className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}
        >
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.claim}
            </legend>
            <GenericUseFormInput
              {...register("updatedClaimNumber")}
              inputFieldClassname={ClmainInfoStyle.customInput}
            />
          </fieldset>
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.status}
            </legend>
            <div className={ClmainInfoStyle.fieldValue}>
              {claimSnapShotData?.claimStatus?.status}
            </div>
          </fieldset>
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.tax}
            </legend>
            <Controller
              name="taxRate"
              control={control}
              render={({ field: { onChange: taxChange } }: any) => (
                <GenericPercentFormat
                  inputFieldClassname={ClmainInfoStyle.customInput}
                  defaultValue={defaultValues?.taxRate}
                  handleChange={({ value, clbk }) => {
                    taxChange(value);
                    const currValue = +value;
                    if (currValue > 99) {
                      clbk && clbk("99");
                      setValue("taxRate", 99);
                    }
                  }}
                />
              )}
            />
          </fieldset>
        </div>
        <div
          className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}
        >
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.elapsedTime}
            </legend>
            <div className={ClmainInfoStyle.fieldValue}>
              {claimSnapShotData?.claimTime}
            </div>
          </fieldset>
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.coverageLimits}
            </legend>
            <Controller
              name="policyLimit"
              control={control}
              render={({ field: { onChange } }) => (
                <GenericCurrencyFormat
                  inputFieldClassname={ClmainInfoStyle.customInput}
                  defaultValue={defaultValues?.policyLimit}
                  handleChange={({ value }) => onChange(value ?? "")}
                />
              )}
            />
          </fieldset>
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.deductible}
            </legend>
            <Controller
              name="deductible"
              control={control}
              render={({ field: { onChange } }) => (
                <GenericCurrencyFormat
                  inputFieldClassname={ClmainInfoStyle.customInput}
                  defaultValue={defaultValues?.deductible}
                  handleChange={({ value }) => onChange(value ?? "")}
                />
              )}
            />
          </fieldset>
        </div>
        <div
          className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}
        >
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.createdDate}
            </legend>
            <div className={ClmainInfoStyle.fieldValue}>
              {convertToCurrentTimezone(claimSnapShotData?.createdDate, dateFormate)}
            </div>
          </fieldset>
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.minItemToPrice}
            </legend>
            <Controller
              name="minimumThreshold"
              control={control}
              render={({ field: { onChange } }) => (
                <GenericCurrencyFormat
                  inputFieldClassname={ClmainInfoStyle.customInput}
                  defaultValue={defaultValues?.minimumThreshold}
                  handleChange={({ value }) => onChange(value ?? "")}
                />
              )}
            />
          </fieldset>
          <fieldset
            className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
          >
            <legend className={ClmainInfoStyle.fieldSetLabel}>
              {translate?.claimDetailsTabTranslate?.claimSnapshot?.lossType}
            </legend>
            <Controller
              name={"damageTypeId"}
              control={control}
              rules={{ required: true }}
              defaultValue={defaultValues?.damageTypeId}
              render={({ field: { ...rest } }: any) => (
                <GenericSelect
                  customStyles={selectBoxStyles}
                  isClearable={false}
                  isSearchable={false}
                  options={selectOptions}
                  getOptionLabel={(option: { name: any }) => option.name}
                  getOptionValue={(option: { id: any }) => option.id}
                  {...rest}
                />
              )}
            />
          </fieldset>
        </div>
      </form>
    </>
  );
};
export default UpdateClaimInfoForm;
