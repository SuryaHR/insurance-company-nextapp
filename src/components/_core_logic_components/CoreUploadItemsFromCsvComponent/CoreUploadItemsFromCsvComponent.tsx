"use client";
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import GenericButton from "@/components/common/GenericButton";
import UploadItemsStyle from "./uploadItemsFromCsvComponent.module.scss";
import ExcelSheetTable from "./ExcelSheetTable";
import { RootState } from "@/store/store";
import Cards from "@/components/common/Cards";
import { useRouter } from "next/navigation";
import { setExcelCsvUploadData } from "@/reducers/_adjuster_reducers/UploadCSV/excelCsvUploadSlice";
import ProgressBar from "@/components/common/ProgressBar";
import { ConnectedProps, connect } from "react-redux";
import { setActiveSection } from "@/reducers/_adjuster_reducers/UploadCSV/navigationSlice";
import { setAddItemsTableData } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { uploadItemFromCsvTranslatePropType } from "@/app/[lang]/(adjuster)/upload-items-from-csv/page";
import selectClaimNumberEncrypted from "@/reducers/Session/Selectors/selectClaimNumberEncrypted";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import selectSessionClaimNumber from "@/reducers/Session/Selectors/selectSessionClaimNumber";
import selectSessionClaimId from "@/reducers/Session/Selectors/selectSessionClaimId";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import {
  fetchAddItemsTableCSVData,
  fetchExcelCsvTableData,
  fetchImportCsvData,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";

const CoreUploadItemsFromCsvComponent: React.FC<connectorType> = (props) => {
  const { translate } =
    useContext<TranslateContextData<uploadItemFromCsvTranslatePropType>>(
      TranslateContext
    );

  const {
    rowsProcessed,
    postLossItemDetails,
    claimNumberEncrypted,
    claimId,
    claimNumber,
    token,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileChosen, setIsFileChosen] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [validItemsCount, setValidItemsCount] = useState<number>(0);
  const [failedItemsCount, setFailedItemsCount] = useState<number>(0);
  const [isUploadFinished, setIsUploadFinished] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleCancelClick = () => {
    setSelectedFile(null);
    setIsFileChosen(false);
    setIsFileUploaded(false);
    setIsLoading(false);
    setUploadProgress(0);
    setExcelData(null);
    setIsUploadFinished(false);
    setShouldRenderContent(false);
  };

  const serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const itemTemplate = process.env.NEXT_PUBLIC_ITEM_TEMPLATE;

  const downloadLink = `${serverAddress}${itemTemplate}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files && event.target.files[0];
    if (fileUploaded) {
      const isXlsx = fileUploaded.name.endsWith(".xlsx");

      setSelectedFile(fileUploaded);
      setIsFileChosen(true);
      setIsFileUploaded(false);
      setIsLoading(false);
      setUploadProgress(isXlsx ? 0 : 90);
    }
  };

  const handleStartUpload = async () => {
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const totalSteps = 10;
        const interval = 500;

        for (let i = 0; i <= totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, interval));
          const step = Math.min(20 + i * 10, 100);
          setUploadProgress(step);
        }

        const response = await fetchExcelCsvTableData(formData, token);

        if (response.status === 200) {
          const { postLossItemDetails } = response.data;
          dispatch(setExcelCsvUploadData(response.data));
          const failedItems = postLossItemDetails.filter(
            (item: any) => !item.isValidItem
          );
          setFailedItemsCount(failedItems.length);
          setValidItemsCount(postLossItemDetails.length - failedItems.length);

          setExcelData(response.data.postLossItemDetails);
          setIsFileUploaded(true);
        } else {
          console.error("Errloadingfile", response);
          setIsFileUploaded(false);
        }
      } catch (error) {
        console.error("Errorpload", error);
        setIsFileUploaded(false);
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    } else {
      setIsLoading(true);
      setUploadProgress(90);
      setTimeout(() => {
        setIsFileUploaded(false);
      }, 2000);
    }
  };

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  useEffect(() => {
    const updatedFailedItems = postLossItemDetails.filter((item) => !item.isValidItem);
    const updatedFailedItems2 = postLossItemDetails.filter((item) => item.isValidItem);

    setFailedItemsCount(updatedFailedItems.length);
    setValidItemsCount(updatedFailedItems2.length);
  }, [postLossItemDetails]);

  useEffect(() => {
    if (selectedFile) {
      hiddenFileInput.current?.setAttribute("value", selectedFile.name);
    } else {
      hiddenFileInput.current?.setAttribute("value", "");
    }
    setUploadProgress(0);
    setExcelData(null);
  }, [selectedFile]);

  const handleRouteChange = () => {
    router.push(
      `/core-logic/core-adjuster-property-claim-details/${claimNumberEncrypted}`
    );
  };

  const handleFinishUpload = async () => {
    let shouldNavigate = false;

    if (isFileUploaded && excelData) {
      setIsUploadFinished(false);
      setUploadProgress(0);
      setIsLoading(false);
      setShouldRenderContent(false);
      setIsButtonDisabled(true);

      const payload = {
        claimNumber,
        postlossItems: postLossItemDetails,
        applyTax: false,
      };

      try {
        const importCsvResponse = await fetchImportCsvData(payload, token);

        if (importCsvResponse.status === 200) {
          const addItemsPayload = { claimId, claimNumber };
          const addItemsTableResponse = await fetchAddItemsTableCSVData(
            addItemsPayload,
            token
          );

          if (addItemsTableResponse.status === 200) {
            dispatch(setAddItemsTableData(addItemsTableResponse.data));

            const { failedItems } = addItemsTableResponse.data || {};
            const invalidItems = postLossItemDetails.filter((item) => !item.isValidItem);

            if (failedItems && failedItems.length > 0) {
              setIsUploadFinished(true);
              setUploadProgress(60);
              shouldNavigate = false;
              setShouldRenderContent(true);
              setIsButtonDisabled(false);
            } else if (invalidItems.length > 0) {
              setIsUploadFinished(true);
              setUploadProgress(0);
              setIsLoading(false);
              setIsButtonDisabled(false);
              const totalSteps = 6;
              const interval = 1000;

              for (let i = 0; i <= totalSteps; i++) {
                await new Promise((resolve) => setTimeout(resolve, interval));
                const percentage = ((i / totalSteps) * 60).toFixed(0);
                setUploadProgress(Number(percentage));
              }
              shouldNavigate = false;
              setShouldRenderContent(true);
              dispatch(
                addNotification({
                  message: "Some items failed to import. Please check the details.",
                  id: "failed_csv",
                  status: "warning",
                })
              );
            } else {
              setIsUploadFinished(true);
              setUploadProgress(0);
              setIsLoading(false);
              const totalSteps = 10;
              const interval = 500;
              setIsButtonDisabled(false);
              dispatch(
                addNotification({
                  message: "Success: All items imported successfully!",
                  id: "success_csv",
                  status: "success",
                })
              );
              for (let i = 0; i <= totalSteps; i++) {
                await new Promise((resolve) => setTimeout(resolve, interval));
                const percentage = ((i / totalSteps) * 100).toFixed(0);
                setUploadProgress(Number(percentage));
              }
              shouldNavigate = true;
            }
          } else {
            console.error("Error fetching addItemsTable data", addItemsTableResponse);
            dispatch(
              addNotification({
                message: "Error: Failed to fetch addItemsTable data.",
                id: "error_csv",
                status: "error",
              })
            );
          }
        } else {
          console.error("Error importing CSV data", importCsvResponse);
          dispatch(
            addNotification({
              message: "Error: Failed to import CSV data.",
              id: "error_csv_file",
              status: "error",
            })
          );
        }
      } catch (error) {
        console.error("Error handling finish upload", error);
        dispatch(
          addNotification({
            message: "Error: An unexpected error occurred.",
            id: "error_csv_file_unexpected",
            status: "error",
          })
        );
      } finally {
        setUploadProgress(0);
        try {
          if (shouldNavigate) {
            router.push(
              `/core-logic/core-adjuster-property-claim-details/${claimNumberEncrypted}`
            );
          }
        } catch (navigationError) {
          console.error("Error during navigation", navigationError);
          dispatch(
            addNotification({
              message: "Error: An error occurred during navigation.",
              id: "error_csv_file_navigation",
              status: "error",
            })
          );
        }
      }
    }
  };
  const pathList = [
    {
      name: claimNumber,
      path: `/core-logic/core-adjuster-property-claim-details/${claimNumberEncrypted}`,
    },
    {
      name: translate?.uploadItemFromCsvTranslate?.bulkUploadItemsHeading,
      active: true,
      path: "",
    },
  ];
  return (
    <>
      <GenericBreadcrumb
        dataList={pathList}
        customClassname={UploadItemsStyle.breadcrumb}
        customNavClassname={UploadItemsStyle.customNav}
      />
      {!isFileUploaded && (
        <div>
          <div className={UploadItemsStyle.uploadSpacing}>
            <GenericComponentHeading
              title={translate?.uploadItemFromCsvTranslate?.bulkUploadItemsHeading}
            />
          </div>
          <div className="row">
            <div className="col-lg-8 mt-2">
              <p className={`mt-2 mb-2 ${UploadItemsStyle.stepsTextStyle}`}>
                {translate?.uploadItemFromCsvTranslate?.stepsforUploading}
              </p>
              <p className={`mb-3 ${UploadItemsStyle.pTextStyle}`}>
                {translate?.uploadItemFromCsvTranslate?.downloadTheCSVTemplate}
                <a href={downloadLink} download>
                  {" "}
                  {translate?.uploadItemFromCsvTranslate?.uploadPostLossItem}{" "}
                </a>{" "}
                {translate?.uploadItemFromCsvTranslate?.toUploadItems}
              </p>
              <p className={`mb-2 ${UploadItemsStyle.pTextStyle}`}>
                {translate?.uploadItemFromCsvTranslate?.fillTheCSV}
              </p>
              <p className={UploadItemsStyle.pTextStyle1}>
                <span className={UploadItemsStyle.dotIcon}></span>{" "}
                {translate?.uploadItemFromCsvTranslate?.fieldsMarkedWith}{" "}
                <span>&#42;</span> {translate?.uploadItemFromCsvTranslate?.mandatory}
              </p>

              <p className={`mb-3 ${UploadItemsStyle.pTextStyle2}`}>
                <span className={UploadItemsStyle.dotIcon}></span>{" "}
                {translate?.uploadItemFromCsvTranslate?.idAlreadyExist}
              </p>

              <p className={`mb-2 ${UploadItemsStyle.pTextStyle}`}>
                {translate?.uploadItemFromCsvTranslate?.loadUpdated}
              </p>
              <form>
                <div className={`row mb-3 ${UploadItemsStyle.formUploadStyle}`}>
                  <div className="col-lg-2 col-md-2 col-sm-6">
                    <label htmlFor="fileInput" className={UploadItemsStyle.labelFile}>
                      {translate?.uploadItemFromCsvTranslate?.chooseFile}
                    </label>
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-6">
                    <input
                      type="text"
                      className={UploadItemsStyle.formControl}
                      placeholder={
                        translate?.uploadItemFromCsvTranslate?.selectBoxPlaceholder
                      }
                      value={selectedFile ? selectedFile.name : ""}
                      readOnly
                    />
                  </div>
                  <div className="col-lg-4 col-md-3">
                    <button
                      type="button"
                      onClick={handleClick}
                      className={UploadItemsStyle.fileButton}
                    >
                      {translate?.uploadItemFromCsvTranslate?.chooseFileBtn}
                    </button>
                    <input
                      type="file"
                      onChange={handleChange}
                      ref={hiddenFileInput}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          {isLoading && (
            <div className={UploadItemsStyle.progressBarContainer}>
              <ProgressBar value={uploadProgress} />
            </div>
          )}
          <div className="row mb-4 justify-content-end">
            <div className="col-auto">
              <GenericButton
                label={translate?.uploadItemFromCsvTranslate?.cancelBtn}
                size="small"
                type="submit"
                onClick={handleRouteChange}
                btnClassname={UploadItemsStyle.newClaimBtn}
              />
            </div>
            <div className="col-auto">
              <GenericButton
                label={translate?.uploadItemFromCsvTranslate?.uploadBtn}
                size="small"
                type="submit"
                btnClassname={UploadItemsStyle.newClaimBtn}
                onClick={handleStartUpload}
                disabled={!isFileChosen || isLoading}
              />
            </div>
          </div>
        </div>
      )}
      {isFileUploaded && excelData && !isUploadFinished && (
        <>
          <Cards className="ml-2 mr-2">
            <div>
              <div>
                <div className="p-2">
                  <GenericComponentHeading
                    title={
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.heading
                    }
                    customHeadingClassname={UploadItemsStyle.infomationStyle}
                    customTitleClassname={UploadItemsStyle.customTitleClassname}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <p className={`mt-2 ${UploadItemsStyle.pTitleText}`}>
                      {
                        translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                          ?.fileName
                      }{" "}
                      <span className={UploadItemsStyle.spanTitle}>
                        {selectedFile ? selectedFile.name : ""}
                      </span>
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="row justify-content-end">
                      <div className="col-auto">
                        <GenericButton
                          label={
                            translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                              ?.cancel
                          }
                          // theme="lightBlue"
                          size="small"
                          type="submit"
                          onClick={() => {
                            handleCancelClick();
                          }}
                        />
                      </div>
                      <div className="col-auto">
                        <GenericButton
                          label={
                            translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                              ?.finishUploadBtn
                          }
                          // theme="lightBlue"
                          size="small"
                          type="submit"
                          onClickHandler={handleFinishUpload}
                          disabled={isButtonDisabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`mt-2 ${UploadItemsStyle.pTitleTextRowsProcess}`}>
                    {
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                        ?.rowsProcessed
                    }{" "}
                    <span className={UploadItemsStyle.spanTitle}>{rowsProcessed}</span>
                  </p>
                </div>
                <div>
                  <p className={`mt-2 ${UploadItemsStyle.pTitleTextRows}`}>
                    {
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                        ?.validItem
                    }{" "}
                    <span className={UploadItemsStyle.spanTitle}>
                      {validItemsCount}/{rowsProcessed}
                    </span>
                  </p>
                </div>
                <div>
                  <p className={`mt-2 mb-3 ${UploadItemsStyle.pTitleTextRowsFailed}`}>
                    {
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                        ?.failedItem
                    }{" "}
                    <span className={UploadItemsStyle.spanTitle}>
                      {failedItemsCount}/{rowsProcessed}
                    </span>
                  </p>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-2" />
                <div className="col-7">
                  {failedItemsCount > 0 && (
                    <div>
                      <table className={UploadItemsStyle.customTable}>
                        <thead>
                          <tr>
                            <th>
                              {
                                translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                                  ?.item
                              }
                            </th>
                            <th>
                              {
                                translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                                  ?.reason
                              }
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {postLossItemDetails
                            .filter((item) => item.isValidItem === false)
                            .map((failedItem) => (
                              <tr key={failedItem.id}>
                                <td>{failedItem.id}</td>
                                <td>{failedItem.failedReasons}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <ExcelSheetTable />
            </div>
          </Cards>
        </>
      )}
      {isUploadFinished && !shouldRenderContent && (
        <Cards className="ml-2 mr-2">
          <div>
            <div className="p-2">
              <GenericComponentHeading
                title={
                  translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.uploadStatus
                }
                customHeadingClassname={UploadItemsStyle.infomationStyle}
                customTitleClassname={UploadItemsStyle.customTitleClassname}
              />
            </div>
            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-12">
                <p className={`mt-2 ${UploadItemsStyle.pTitleTextfinish}`}>
                  {
                    translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                      ?.fileNameUpl
                  }{" "}
                  <span className={UploadItemsStyle.spanTitle}>
                    {selectedFile ? selectedFile.name : ""}
                  </span>
                </p>
              </div>
            </div>
            <div className="d-flex mt-2">
              <div className="col-lg-2 col-md-2">
                <p className={`mt-2 ${UploadItemsStyle.statusTextfinish}`}>
                  {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.statusUpl}
                </p>
              </div>
              <div
                className={`col-lg-7 col-md-7 mt-2 ${UploadItemsStyle.progressBarContainer2}`}
              >
                <ProgressBar value={uploadProgress} />
              </div>
              {/* </div> */}
            </div>
            <div>
              <p className={`mt-2 ${UploadItemsStyle.pTitleTextRowsProcessfinish}`}>
                {
                  translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                    ?.rowsProcessedUpl
                }{" "}
                <span className={UploadItemsStyle.spanTitle}>0/{rowsProcessed}</span>
              </p>
            </div>
            <div>
              <p className={`mt-2 ${UploadItemsStyle.newItemsCreatedfinish}`}>
                {
                  translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                    ?.newItemCreated
                }{" "}
                <span className={UploadItemsStyle.spanTitle}>0/{rowsProcessed}</span>
              </p>
            </div>
            <div>
              <p className={`mt-2 ${UploadItemsStyle.itemsUpdatedfinish}`}>
                {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.itemUpdated}{" "}
                <span className={UploadItemsStyle.spanTitle}>0/{rowsProcessed}</span>
              </p>
            </div>
            <div>
              <p className={`mt-2 ${UploadItemsStyle.pTitleTextRowsfinish}`}>
                {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.validItems}{" "}
                <span className={UploadItemsStyle.spanTitle}>
                  {validItemsCount}/{rowsProcessed}
                </span>
              </p>
            </div>
            <div>
              <p className={`mt-2 mb-3 ${UploadItemsStyle.pTitleTextRowsFailedfinish}`}>
                {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.failedItems}{" "}
                <span className={UploadItemsStyle.spanTitle}>
                  {failedItemsCount}/{rowsProcessed}
                </span>
              </p>
            </div>
            <div className="row mb-4">
              <div className="col-2" />
              <div className="col-7">
                {failedItemsCount > 0 && (
                  <div>
                    <table className={UploadItemsStyle.customTable}>
                      <thead>
                        <tr>
                          <th>
                            {
                              translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                                ?.item
                            }
                          </th>
                          <th>
                            {
                              translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                                ?.reason
                            }
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {postLossItemDetails
                          .filter((item) => item.isValidItem === false)
                          .map((failedItem) => (
                            <tr key={failedItem.id}>
                              <td>{failedItem.id}</td>
                              <td>{failedItem.failedReasons}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Cards>
      )}

      {isFileUploaded && excelData && isUploadFinished && shouldRenderContent && (
        <>
          <Cards className="ml-2 mr-2">
            <div>
              <div>
                <div className="p-2">
                  <GenericComponentHeading
                    title={
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.heading
                    }
                    customHeadingClassname={UploadItemsStyle.infomationStyle}
                    customTitleClassname={UploadItemsStyle.customTitleClassname}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <p className={`mt-2 ${UploadItemsStyle.pTitleText}`}>
                      {
                        translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                          ?.fileName
                      }{" "}
                      <span className={UploadItemsStyle.spanTitle}>
                        {selectedFile ? selectedFile.name : ""}
                      </span>
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="row justify-content-end">
                      <div className="col-auto">
                        <GenericButton
                          label={
                            translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                              ?.cancel
                          }
                          // theme="lightBlue"
                          size="small"
                          type="submit"
                          onClick={() => {
                            handleCancelClick();
                          }}
                        />
                      </div>
                      <div className="col-auto">
                        <GenericButton
                          label={
                            translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                              ?.finishUploadBtn
                          }
                          // theme="lightBlue"
                          size="small"
                          type="submit"
                          onClickHandler={handleFinishUpload}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`mt-2 ${UploadItemsStyle.pTitleTextRowsProcess}`}>
                    {
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                        ?.rowsProcessed
                    }{" "}
                    <span className={UploadItemsStyle.spanTitle}>{rowsProcessed}</span>
                  </p>
                </div>
                <div>
                  <p className={`mt-2 ${UploadItemsStyle.pTitleTextRows}`}>
                    {
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                        ?.validItem
                    }{" "}
                    <span className={UploadItemsStyle.spanTitle}>
                      {validItemsCount}/{rowsProcessed}
                    </span>
                  </p>
                </div>
                <div>
                  <p className={`mt-2 mb-3 ${UploadItemsStyle.pTitleTextRowsFailed}`}>
                    {
                      translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                        ?.failedItem
                    }{" "}
                    <span className={UploadItemsStyle.spanTitle}>
                      {failedItemsCount}/{rowsProcessed}
                    </span>
                  </p>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-2" />
                <div className="col-7">
                  {failedItemsCount > 0 && (
                    <div>
                      <table className={UploadItemsStyle.customTable}>
                        <thead>
                          <tr>
                            <th>
                              {
                                translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                                  ?.item
                              }
                            </th>
                            <th>
                              {
                                translate?.uploadItemFromCsvTranslate?.uploadedFileSection
                                  ?.reason
                              }
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {postLossItemDetails
                            .filter((item) => item.isValidItem === false)
                            .map((failedItem) => (
                              <tr key={failedItem.id}>
                                <td>{failedItem.id}</td>
                                <td>{failedItem.failedReasons}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <ExcelSheetTable />
            </div>
          </Cards>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  postLossItemDetails: state.excelCsvUpload.postLossItemDetails,
  rowsProcessed: state.excelCsvUpload.rowsProcessed,
  activeSection: state.navigation.activeSection,
  addItemsTableData: state.addItemsTable.addItemsTableData,
  claimNumberEncrypted: selectClaimNumberEncrypted(state),
  token: selectAccessToken(state),
  claimNumber: selectSessionClaimNumber(state),
  claimId: selectSessionClaimId(state),
});

const mapDispatchToProps = {
  setExcelCsvUploadData,
  setActiveSection,
  setAddItemsTableData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(CoreUploadItemsFromCsvComponent);
