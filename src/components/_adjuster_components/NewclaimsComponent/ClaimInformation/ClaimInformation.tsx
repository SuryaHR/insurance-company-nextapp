import React, { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import ClaimInformationStyle from "./claimInformation.module.scss";
import Tooltip from "@/components/common/ToolTip/index";
import GenericSelect from "@/components/common/GenericSelect/index";
import DateTimePicker from "@/components/common/DateTimePicker/index";
import Cards from "@/components/common/Cards/index";
import {
  fetchHomeOwnersType,
  fetchLossType,
  validateClaim,
  getCategories,
} from "@/services/_adjuster_services/ClaimService";
import { IoClose } from "react-icons/io5";
import CategoryCoverage from "./CategoryCoverage";
// import { isEmpty } from "lodash";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { unknownObjectType } from "@/constants/customTypes";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import GenericCurrencyFormat from "@/components/common/GenericInput/GenericCurrencyFormat";
import GenericPercentFormat from "@/components/common/GenericInput/GenericPercentFormat";
import Image from "next/image";
import GenericButton from "@/components/common/GenericButton";

function ClaimInformation({
  register,
  error,
  control,
  setError,
  clearErrors,
  homeOwnerTypeOptions,
  getValues,
  setValue,
  resetField,
  setPolicyDetails,
  applytax,
  setApplyTax,
  policyNumber,
  setSelectedFile,
  docs,
  setDocs,
  translate,
}: any) {
  const [lossType, setLossType] = useState([]);
  const [CategoryCoverageData, setCategoryCoverageData] = useState<any>([]);
  const [HOsection, setHOsection] = useState(false);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);
  const [showAnotherSplCat, setAnotherSplCat] = useState(false);
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [coverageLimit, setcoverageLimit] = useState<any>(0);
  const [individualItemLimit, setindividualItemLimit] = useState<any>(0);

  const [searchQuery] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);

  const [selectedDate, setSelectedDate] = useState<React.SetStateAction<null> | Date>(
    null
  );

  const handleDateChange = (date: React.SetStateAction<null> | Date) => {
    setSelectedDate(date);
  };

  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("applyTax", e.target.value);
    setApplyTax(e.target.value);
  };

  const claimHandler = (claim: any) => {
    if (!claim) return;
    validateClaim({
      claimNumber: claim,
    })
      .then((res) => {
        const isValidInput: RegExp = /^[a-zA-Z0-9/-]+$/;
        if (res.data)
          setError("claim", {
            type: "manual",
            message: "The claim number already exists",
          });
        else if (claim.match(isValidInput) === null)
          setError("claim", {
            type: "manual",
            message: "Enter the claim correctly",
          });
        else {
          clearErrors("claim");
        }
      })
      .catch((error: any) => console.log("claim error", error));
  };

  const handleDelete = (categoryId: any) => {
    const newList = CategoryCoverageData.filter(
      (li: { categoryId: any }) => li.categoryId !== categoryId
    );

    setCategoryCoverageData(newList);
    const selectedCategory: any = [];

    newList.map((item: any) => {
      selectedCategory.push({
        categoryId: item.categoryId,
        coverageLimit: item.coverageLimit,
        individualItemLimit: item.individualItemLimit,
      });
    });
    setPolicyDetails((prev: any) => {
      return { ...prev, selectedCategory: selectedCategory };
    });
  };
  useEffect(() => {
    fetchLossType().then((res) => {
      setLossType(res.data);
    });
    getCategories()
      .then((res: any) => {
        setCategoriesData(res.data);
      })
      .catch((error) => console.log(" fetchLossType API error", error));
  }, []);

  const addAnotherSpecialCategory = () => {
    setAnotherSplCat(true);
  };

  const handleInputChange = async (e: any) => {
    if (e) {
      setAnotherSplCat(false);
      const newcatList = {
        ...e,
        coverageLimit: Number(coverageLimit),
        individualItemLimit: Number(individualItemLimit),
      };
      setCategoryCoverageData((prev: any) => {
        return [...prev, newcatList];
      });
      setPolicyDetails((prev: any) => {
        return {
          ...prev,
          selectedCategory: [
            ...prev.selectedCategory,
            {
              categoryId: e.categoryId,
              coverageLimit: coverageLimit,
              individualItemLimit: individualItemLimit,
            },
          ],
        };
      });
      setcoverageLimit(0);
      setindividualItemLimit(0);
    }
  };

  const { onBlur: blurHandler, onChange: claimChange, ...rest } = register("claim");

  const coverageApiCall = async (stateId: number, policyTypeId: number) => {
    const [state, homeOwnerPlocyType] = getValues(["state", "homeOwnersPolicyType"]);
    stateId = state?.id;
    policyTypeId = homeOwnerPlocyType?.id;
    const selectedCategory: any = [];
    await fetchHomeOwnersType(stateId, policyTypeId)
      .then((res) => {
        setCategoryCoverageData(res.data);
        res.data.map((item: any) => {
          selectedCategory.push({
            categoryId: item.categoryId,
            coverageLimit: item.coverageLimit,
            individualItemLimit: item.individualItemLimit,
          });
        });
      })
      .catch((error) => console.log(" Coverage ApI error", error));

    setHOsection(true);

    if (homeOwnerPlocyType?.id) {
      let totalSpecialLimit = 0;
      const flag = homeOwnerTypeOptions.filter(
        (item: any) => item.id === homeOwnerPlocyType?.id
      );
      if (flag.length > 0) {
        flag[0].categories.map((item: any) => {
          totalSpecialLimit =
            Number(totalSpecialLimit) +
            (item.coverageLimit !== null ? Number(item.coverageLimit) : 0);
        });
        const totalCoverage = flag[0].totalCoverage;
        const totalDetuctibleAmount = flag[0].totalDeductible;
        const propertyCoverage =
          totalCoverage && totalCoverage !== null
            ? totalCoverage > 0
              ? (Number(totalCoverage) / 2).toFixed(2)
              : 0
            : null;
        const totalThresholdAmount = flag[0].totalThreshold;

        const policyDetailsArr = {
          totalCoverage,
          totalDetuctibleAmount,
          propertyCoverage,
          totalThresholdAmount,
          totalSpecialLimit,
          selectedCategory: selectedCategory,
        };
        setPolicyDetails(policyDetailsArr);
      }
    } else {
      resetField("homeOwnersPolicyType", { defaultValue: null });
      setPolicyDetails({});
      setCategoryCoverageData([]);
      setHOsection(false);
    }
  };
  const handleUpload = (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.substr(file.name.lastIndexOf("."));
        const nameExists = docs.some((item: any) => item.fileName.includes(file.name));

        if (!nameExists) {
          const imageUrl = URL.createObjectURL(file);

          const newObj = {
            fileName: file.name,
            fileType: file.type,
            extension: fileExtension,
            filePurpose: "Claim",
            latitude: null,
            longitude: null,
            footNote: "No foot note",

            imgType: fileExtension,
            url: imageUrl,
          };

          setDocs((prev: any) => [...prev, newObj]);
          selectedFiles.push(file);
        }
      }

      setSelectedFile((prev: any) => [...prev, ...selectedFiles]);
    }
    event.target.value = null;
  };

  const handleDeleteImage = (index: number) => {
    const docArray = docs.filter((elem: any, ind: any) => {
      if (ind !== index) {
        return elem;
      }
    });
    setDocs([...docArray]);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 5);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel - 5);
  };

  const handleZoomMid = () => {
    setZoomLevel(100);
  };

  const openModal = (data: any) => {
    setPreviewFile(data);
    setImagePreviewModalOpen(true);
  };

  const closeModal = () => {
    setImagePreviewModalOpen(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const changeHOvalue = (categoryName: string, type: string, value: number) => {
    const categoryIndex = CategoryCoverageData.findIndex(
      (category: any) => category.categoryName === categoryName
    );

    if (categoryIndex !== -1) {
      if (type === "coverageLimit") {
        CategoryCoverageData[categoryIndex].coverageLimit = value;

        setCategoryCoverageData([...CategoryCoverageData]);
      } else if (type === "individualItemLimit") {
        CategoryCoverageData[categoryIndex].individualItemLimit = value;

        setCategoryCoverageData([...CategoryCoverageData]);
      }
      const selectedCategory: any = [];
      CategoryCoverageData.map((item: any) => {
        selectedCategory.push({
          categoryId: item.categoryId,
          coverageLimit: item.coverageLimit,
          individualItemLimit: item.individualItemLimit,
        });
      });
      setPolicyDetails((prev: any) => {
        return { ...prev, selectedCategory: selectedCategory };
      });
    }
  };

  return (
    <div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            {" "}
            <span className={ClaimInformationStyle.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.claimText?.claim ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericUseFormInput
            placeholder="Claim#"
            showError={error["claim"]}
            errorMsg={error?.claim?.message}
            {...rest}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              blurHandler(e);
              const claimValue = e.target.value;

              claimHandler(claimValue);
            }}
            onChange={(e: any) => {
              claimChange(e);
            }}
            disabled={policyNumber}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            {translate?.newClaimTransalate?.newClaim?.claimText?.claimDate ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            control={control}
            name="claimDate"
            rules={{ required: true }}
            defaultValue={new Date()}
            render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
              return (
                <DateTimePicker
                  name="claimDate"
                  placeholderText="12/06/2023"
                  showError={true}
                  errorMsg="kkkk"
                  errorMsgClassname="erressage"
                  labelClassname="labeext"
                  formControlClassname="forontrol"
                  value={selectedDate}
                  onChange={(e) => {
                    fieldOnChange(e);
                    handleDateChange(e);
                  }}
                  dateFormat="MM/dd/yyyy"
                  enableTime={true}
                  time_24hr={true}
                  minDate={null}
                  maxDate={null}
                  {...rest}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            <span className={ClaimInformationStyle.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.claimText?.InsuranceCompany ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericUseFormInput
            placeholder="Insurance Company"
            {...register("insuranceCompany")}
            disabled={policyNumber}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            <span className={ClaimInformationStyle.redColor}>*</span>
            {translate?.newClaimTransalate?.newClaim?.claimText?.adjusterName ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericUseFormInput
            placeholder="Adjuster's Name"
            {...register("adjusterName")}
            disabled={policyNumber}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            {" "}
            {translate?.newClaimTransalate?.newClaim?.claimText?.lossDamageType ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          {" "}
          <Controller
            control={control}
            name="lossType"
            rules={{ required: false }}
            render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
              return (
                <GenericSelect
                  options={lossType}
                  {...rest}
                  onChange={(e: any) => {
                    fieldOnChange(e);
                  }}
                  getOptionLabel={(option: { name: any }) => option.name}
                  getOptionValue={(option: { id: any }) => option.id}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            {" "}
            {translate?.newClaimTransalate?.newClaim?.claimText?.claimDescription ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <textarea
            {...register("claimDescription")}
            className={ClaimInformationStyle.textArea}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            <span className={ClaimInformationStyle.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.claimText?.claimDeductable ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            name="claimDeductible"
            control={control}
            render={({ field: { onChange: claimDeductibleChange } }) => (
              <GenericCurrencyFormat
                handleChange={({ value }) => {
                  claimDeductibleChange(value);
                }}
                id="claimDeductible"
                errorMsg={error?.claimDeductible?.message}
                showError={error["claimDeductible"]}
              />
            )}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <div className="d-flex">
            <div className={`col-lg-10 mt-1 ${ClaimInformationStyle.labelContent}`}>
              <label className={ClaimInformationStyle.labelContainer}>
                <span className={ClaimInformationStyle.redColor}>*</span>
                {translate?.newClaimTransalate?.newClaim?.claimText?.minItemProduct ?? ""}
                <span>
                  <Tooltip
                    text={
                      <span>
                        {translate?.newClaimTransalate?.newClaim?.claimText
                          ?.minimumDollar ?? ""}
                        <br />{" "}
                        {translate?.newClaimTransalate?.newClaim?.claimText
                          ?.needsPricedByCarrier ?? ""}
                        <br />{" "}
                        {translate?.newClaimTransalate?.newClaim?.claimText
                          ?.LessThanAccepted ?? ""}
                        <br />{" "}
                        {translate?.newClaimTransalate?.newClaim?.claimText
                          ?.itemFaceValue ?? ""}
                      </span>
                    }
                  />
                </span>
              </label>{" "}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            name="minItemPrice"
            control={control}
            render={({ field: { onChange: minItemChange } }) => (
              <GenericCurrencyFormat
                handleChange={({ value }) => {
                  minItemChange(value);
                }}
                id="minItemPrice"
                errorMsg={error?.minItemPrice?.message}
                showError={error["minItemPrice"]}
              />
            )}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            <span className={ClaimInformationStyle.redColor}>*</span>
            {translate?.newClaimTransalate?.newClaim?.claimText?.taxRate ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            name="taxRate"
            control={control}
            render={({ field: { onChange: taxChange, value: value } }: any) => (
              <GenericPercentFormat
                placeholder="0.00%"
                inputFieldClassname="hideInputArrow"
                showError={error["taxRate"]}
                errorMsg={error?.taxRate?.message}
                disabled={applytax === "no"}
                defaultValue={value}
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
        </div>
        <div className="col-lg-4 col-md-2 col-sm-12 mt-2 d-flex align-items-center">
          <label className={ClaimInformationStyle.label}>
            <span className={ClaimInformationStyle.redColor}>*</span>
            {translate?.newClaimTransalate?.newClaim?.claimText?.applyTaxes ?? ""}
          </label>
          <GenericNormalInput
            type="radio"
            name="applytax"
            formControlClassname={ClaimInformationStyle.formControl}
            inputFieldWrapperClassName={ClaimInformationStyle.wrapper}
            inputFieldClassname={ClaimInformationStyle.inputField}
            value="yes"
            label="Yes"
            labelClassname={ClaimInformationStyle.labelClassname}
            checked={applytax === "yes"}
            onChange={onOptionChange}
          />
          <GenericNormalInput
            type="radio"
            name="applytax"
            formControlClassname={ClaimInformationStyle.formControl1}
            inputFieldWrapperClassName={ClaimInformationStyle.wrapper1}
            inputFieldClassname={ClaimInformationStyle.inputField1}
            value="no"
            label="No"
            labelClassname={ClaimInformationStyle.labelClassname}
            checked={applytax === "no"}
            onChange={onOptionChange}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            <span className={ClaimInformationStyle.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.claimText?.contentLimits ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            name="contentLimits"
            control={control}
            render={({ field: { onChange: contentLimitsChange } }) => (
              <GenericCurrencyFormat
                handleChange={({ value }) => {
                  contentLimitsChange(value);
                }}
                id="contentLimits"
                errorMsg={error?.contentLimits?.message}
                showError={error["contentLimits"]}
              />
            )}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2  text-right">
          <label className={ClaimInformationStyle.label}>
            {translate?.newClaimTransalate?.newClaim?.claimText?.homeOwnersPolicyType ??
              ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            control={control}
            name="homeOwnersPolicyType"
            render={({ field: { onChange: onSelect, ...rest } }: any) => {
              return (
                <GenericSelect
                  options={homeOwnerTypeOptions}
                  {...rest}
                  disabled={!homeOwnerTypeOptions.length}
                  showError={error["homeOwnersPolicyType"]}
                  errorMsg={error?.homeOwnersPolicyType?.message}
                  getOptionLabel={(option: { typeName: any }) => option.typeName}
                  getOptionValue={(option: { id: any }) => option.id}
                  onChange={(e: any) => {
                    onSelect(e);
                    coverageApiCall(e?.stateId, e?.policyTypeId);
                  }}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="row mt-2 align-items-center">
        {HOsection ? (
          <>
            <div className="col-lg-3 col-md-2 col-sm-12 mt-1 text-right">
              <label className={ClaimInformationStyle.label}>
                {translate?.newClaimTransalate?.newClaim?.claimText?.specialLimit ?? ""}
              </label>
            </div>
            <div className={`col-2 mt-2 ${ClaimInformationStyle.specialLimit}`}>
              {" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(getValues("homeOwnersPolicyType")?.specialLimit)}
            </div>
            <div>
              <Cards className={`mt-3 ${ClaimInformationStyle.cards} `}>
                <div className="row mb-2">
                  <div className={`col-5 ${ClaimInformationStyle.coverages}`}>
                    {translate?.newClaimTransalate?.newClaim?.claimText
                      ?.categoryCoverage ?? ""}
                  </div>
                  <div className={`col-2 ${ClaimInformationStyle.category}`}>
                    {translate?.newClaimTransalate?.newClaim?.claimText?.category ?? ""}
                  </div>
                  <div className={`col-2 ${ClaimInformationStyle.aggregateCoverage}`}>
                    {translate?.newClaimTransalate?.newClaim?.claimText
                      ?.aggregateCoverage ?? ""}
                  </div>
                  <div className={`col ${ClaimInformationStyle.itemLimit}`}>
                    {translate?.newClaimTransalate?.newClaim?.claimText
                      ?.individualItemLimit ?? ""}
                  </div>
                </div>
                <div className="row">
                  <>
                    <ul>
                      {CategoryCoverageData.map((value: any, i: number) => (
                        <CategoryCoverage
                          data={value}
                          key={i}
                          handleDelete={handleDelete}
                          register={register}
                          changeHOvalue={changeHOvalue}
                        />
                      ))}
                    </ul>
                  </>
                </div>
                {showAnotherSplCat && (
                  <div
                    className={`row d-flex justify-content-end 
                      ${ClaimInformationStyle.specialCategoryDiv}`}
                  >
                    <div
                      className={`col-lg-6 col-md-6 col-sm-12 ${ClaimInformationStyle.search}`}
                    >
                      <GenericSelect
                        placeholder="Enter Category"
                        value={searchQuery}
                        name="Category"
                        options={categoriesData}
                        getOptionLabel={(option: { categoryName: any }) =>
                          option?.categoryName
                        }
                        getOptionValue={(option: { categoryId: any }) =>
                          option.categoryId
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <div
                      className={`col-lg-2 col-md-3 col-sm-3 ${ClaimInformationStyle.categoryInput}`}
                    >
                      <GenericCurrencyFormat
                        placeholder="$0.00"
                        inputFieldClassname="hideInputArrow"
                        handleChange={({ value }: any) => {
                          setcoverageLimit(value);
                        }}
                        defaultValue={coverageLimit}
                      />
                    </div>
                    <div
                      className={`col-lg-2 ${ClaimInformationStyle.specialcategoryInput}`}
                    >
                      <GenericCurrencyFormat
                        placeholder="$0.00"
                        inputFieldClassname="hideInputArrow"
                        handleChange={({ value }: any) => {
                          setindividualItemLimit(value);
                        }}
                        defaultValue={individualItemLimit}
                      />
                    </div>
                    <div className="col-lg-1" />
                  </div>
                )}
                <div className={`col-lg-12 ${ClaimInformationStyle.specialCategory}`}>
                  <GenericButton
                    theme="linkBtn"
                    onClickHandler={() => addAnotherSpecialCategory()}
                    label={
                      translate?.newClaimTransalate?.newClaim?.claimText
                        ?.addAnotherSpecialCategory ?? ""
                    }
                  />
                </div>
              </Cards>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="row align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimInformationStyle.label}>
            {translate?.newClaimTransalate?.newClaim?.claimText?.attachements ?? ""}
          </label>
        </div>
        <div className="col-lg-2 mt-2">
          {" "}
          <label
            onClick={() => fileInputRef?.current && fileInputRef?.current?.click()}
            role="button"
            className={ClaimInformationStyle.fileType}
          >
            {translate?.newClaimTransalate?.newClaim?.claimText?.clickAddAttachment ?? ""}
          </label>
          <input
            type="file"
            id="inp"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            // accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleUpload}
          ></input>
        </div>
        <div className="row">
          <div className="col-lg-3" />

          {docs?.length === 0 && (
            <div className={`${ClaimInformationStyle.contentCenter} row p-3`}></div>
          )}
          {docs?.map((elem: any, index: number) => {
            const fileExtension = elem.imgType;
            let placeHolderImg: any = "";
            if (fileExtension.includes("xlsx") || fileExtension.includes("xls")) {
              placeHolderImg = excelImg.src;
            } else if (fileExtension.includes("pdf")) {
              placeHolderImg = pdfImg.src;
            } else if (fileExtension.includes("doc") || fileExtension.includes("docx")) {
              placeHolderImg = docImg.src;
            } else if (
              fileExtension.includes("jpg") ||
              fileExtension.includes("jpeg") ||
              fileExtension.includes("png")
            ) {
              placeHolderImg = elem.url;
            } else {
              placeHolderImg = unKnownImg.src;
            }

            return (
              <div className="col-2 m-2" key={index}>
                <div
                  style={{ position: "relative", left: "100px" }}
                  onClick={() => handleDeleteImage(index)}
                >
                  {" "}
                  <IoClose style={{ color: "#f20707" }} />
                </div>
                <div>
                  <Image
                    key={index} // Add a unique key for each element
                    src={placeHolderImg}
                    alt={`Image ${index}`} // Add alt text for accessibility
                    style={{
                      display: "inline-block",
                      objectFit: "cover",
                      height: "100px",
                      aspectRatio: 400 / 400,
                    }}
                  />
                </div>
                <a
                  className={ClaimInformationStyle.textEllipsis}
                  onClick={() => openModal(elem)}
                  key={index}
                >
                  {elem.fileName}
                </a>
              </div>
            );
          })}
        </div>
        <div className="col-8">
          <ImagePreviewModal
            isOpen={imagePreviewModalOpen}
            onClose={closeModal}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleZoomMid={handleZoomMid}
            prevSelected={previewFile}
            showDelete={false}
            childComp={
              <AttachementPreview prevSelected={previewFile} zoomLevel={zoomLevel} />
            }
            modalClassName={true}
            headingName={"Image preview model"}
          ></ImagePreviewModal>
        </div>
      </div>
    </div>
  );
}

export default ClaimInformation;
