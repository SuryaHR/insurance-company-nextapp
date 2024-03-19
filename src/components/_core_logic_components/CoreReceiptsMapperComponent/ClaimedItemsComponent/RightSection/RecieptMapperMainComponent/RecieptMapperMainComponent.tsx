"use client";
import React, { useState, useEffect, useRef } from "react";
import ReceiptMapperPdfList from "../ReceiptMapperPdfList/ReceiptMapperPdfList";
import { RiListCheck } from "react-icons/ri";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import receiptMapperStyle from "../../../receiptMapperComponent.module.scss";
import GenericButton from "@/components/common/GenericButton/index";
import ReciptMapperSearchBox from "../ReciptMapperSearchBox/ReciptMapperSearchBox";
import { useParams } from "next/navigation";
import RecieptMapperPdfViewer from "../RecieptMapperPdfViewer/RecieptMapperPdfViewer";
import {
  addSelectedFile,
  addSelectedMappPoint,
  receiptMapperDate,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { ConnectedProps, connect } from "react-redux";
import CustomLoader from "@/components/common/CustomLoader/index";
import Modal from "@/components/common/ModalPopups/index";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import {
  getReceiptMapperDate,
  receiptApiUrl,
} from "@/services/_core_logic_services/CoreReceiptMapperService";
import AddLabelModalComponent from "../../../AddLabelModalComponent/AddLabelModalComponent";
import { IoMdAddCircle } from "react-icons/io";
import { FaExpandAlt } from "react-icons/fa";
import { FaCompressAlt } from "react-icons/fa";

interface typeProps {
  [key: string | number]: any;
}
const RecieptMapperMainComponent: React.FC<connectorType & typeProps> = ({
  selectedPdf,
  addNotification,
  addSelectedFile,
  addSelectedMappPoint,
  token,
  receiptMapperDate,
  divEnlarge,
  divEnlargeFunc,
}) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);
  const { claimId } = useParams();

  const [showPdfViewer, setPdfViewer] = useState(false);
  const [showListLoader, setListLoader] = useState(false);
  const [tagModelOpen, setTagModelOpen] = useState<boolean>(false);
  const [pdfId, setpdfId] = useState<any>();

  const getItems = async () => {
    setListLoader(true);
    const resp = await getReceiptMapperDate(
      {
        claimId: claimId,
      },
      token
    );
    if (resp.status === 200) {
      receiptMapperDate({ receiptMapperPdf: resp.data });
    }

    setListLoader(false);
  };

  const BtnLabelWithIcon = ({ text }: any) => {
    return (
      <>
        {<IoMdAddCircle />}
        <span className="mx-2">{text}</span>
      </>
    );
  };

  useEffect(() => {
    if (selectedPdf?.pdfId) {
      setPdfViewer(true);
    } else {
      setPdfViewer(false);
    }
  }, [selectedPdf]);

  const handleOpenTag = (pdfId: number) => {
    setTagModelOpen(true);
    setpdfId(pdfId);
  };
  const handleReceipt = (e: any) => {
    const formData: any = new FormData();

    formData.append("pdfFile", e.target.files[0]);
    formData.append("pdfName", e.target.files[0].name);
    formData.append("claimId", claimId);

    receiptApiUrl(formData, token)
      .then(async () => {
        e.preventDefault();
        if (e.target.files[0].type !== "application/pdf") {
          addNotification({
            message: "Please enter the PDF file",
            id: "receipt_file_message",
            status: "error",
          });
        } else {
          const resp = await getReceiptMapperDate(
            {
              claimId: claimId,
            },
            token
          );
          if (resp.status === 200) {
            receiptMapperDate({ receiptMapperPdf: resp.data });
          }
          setPdfViewer(false);
          addNotification({
            message: "Pdf uploaded Successfully.",
            id: "receipt_file_upload_Success",
            status: "success",
          });
        }
      })
      .catch((error) => console.log(" receiptApiUrl Failed", error));
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeTagModel = () => {
    setTagModelOpen(false);
    getItems();
  };

  return (
    <div className={receiptMapperStyle.receiptMapperContainer}>
      {showListLoader && <CustomLoader loaderType="spinner1" />}

      <div className={receiptMapperStyle.receiptMapperListContainer}>
        <div className="col-1">
          {divEnlarge ? (
            <span className={receiptMapperStyle.expandIcon}>
              <FaCompressAlt onClick={divEnlargeFunc} />
            </span>
          ) : (
            <span className={receiptMapperStyle.expandIcon}>
              <FaExpandAlt onClick={divEnlargeFunc} />
            </span>
          )}
        </div>

        <div className="col-4">
          <GenericButton
            label={
              <BtnLabelWithIcon
                text={translate?.receiptMapperTranslate?.claimedItems?.newReceipt}
              />
            }
            size="small"
            btnClassname={receiptMapperStyle.btnWidth}
            onClick={() => fileInputRef?.current && fileInputRef?.current?.click()}
          />
          <input
            type="file"
            id="inp"
            multiple
            ref={fileInputRef}
            hidden
            accept=".pdf"
            onChange={handleReceipt}
          ></input>
        </div>
        <div className="col-7 text-right">
          {showPdfViewer ? (
            <div
              className="cursor-pointer"
              onClick={async () => {
                setListLoader(true);
                addSelectedMappPoint({ selectedMappedItem: {} });
                addSelectedFile({ selectedPdf: {} });
                setPdfViewer(false);
                setListLoader(false);
              }}
            >
              <RiListCheck size="25px" fill="white" />
            </div>
          ) : (
            <ReciptMapperSearchBox setListLoader={setListLoader} />
          )}
        </div>
      </div>
      {showPdfViewer ? (
        <RecieptMapperPdfViewer
          setListLoader={setListLoader}
          handleOpenTag={handleOpenTag}
        />
      ) : (
        <ReceiptMapperPdfList
          setListLoader={setListLoader}
          setPdfViewer={setPdfViewer}
          handleOpenTag={handleOpenTag}
        />
      )}
      {tagModelOpen && (
        <Modal
          isOpen={tagModelOpen}
          onClose={closeTagModel}
          childComp={
            <AddLabelModalComponent closeTagModel={closeTagModel} pdfId={pdfId} />
          }
          headingName={translate?.receiptMapperTranslate?.claimedItems?.labels}
          modalWidthClassName={receiptMapperStyle.tagModalWidth}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  selectedPdf: state.receiptMapper.selectedPdf,
  token: selectAccessToken(state),
});

const mapDispatchToProps = {
  addNotification,
  addSelectedFile,
  addSelectedMappPoint,
  receiptMapperDate,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(RecieptMapperMainComponent);
