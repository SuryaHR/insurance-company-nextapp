"use client";
import React, { useEffect, useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { RiZoomInFill } from "react-icons/ri";
import { RiZoomOutFill } from "react-icons/ri";
import { ImPriceTags } from "react-icons/im";
import { ConnectedProps, connect } from "react-redux";
import { RiFileEditFill } from "react-icons/ri";
import receiptMapperStyle from "../../../receiptMapperComponent.module.scss";
import PdfViewer from "@/components/common/PdfViewer/PdfViewer";
import { getUSDCurrency } from "@/utils/utitlity";
import {
  addSelectedMappPoint,
  setmapperOpen,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import MapperPopup from "./MapperPopup";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import {
  deleteMappedLineItem,
  getClaimedItems,
} from "@/services/_core_logic_services/CoreReceiptMapperService";
import { addClaimedItemsListData } from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";

interface typeProps {
  [key: string | number]: any;
}
const RecieptMapperPdfViewer: React.FC<connectorType & typeProps> = ({
  selectedPdf,
  selectedMappedItem,
  addSelectedMappPoint,
  setmapperOpen,
  addNotification,
  claimedItemsList,
  setListLoader,
  handleOpenTag,
  token,
  addClaimedItemsListData,
}) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [tooltipPoint, setTooltipPoint] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mappedPoints, setMappedPoints] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDelete, setShowDelete] = useState(false);
  const { claimId } = useParams();

  useEffect(() => {
    if (selectedMappedItem.isMapped) {
      setMappedPoints(true);
      setPageNumber(selectedMappedItem.pdfpageNumber ?? 1);
      setModalIsOpen(false);
      setmapperOpen({ isopenmapper: false });
    } else {
      setMappedPoints(false);
      setPageNumber(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMappedItem]);
  const handlePointClick = (event: any) => {
    const boundingBox = event.target.getBoundingClientRect();
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top + 23;

    setTooltipPoint({ x, y });
    setIsDragging(false);
    setModalIsOpen(true);
    setmapperOpen({ isopenmapper: true });

    addSelectedMappPoint({ selectedMappedItem: {} });
  };

  const handlePointClickEdit = (x: number, y: number) => {
    setTooltipPoint({ x: x + 23, y });
    setIsDragging(false);
    setModalIsOpen(true);
    setmapperOpen({ isopenmapper: true });
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale * 1.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale / 1.1);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setmapperOpen({ isopenmapper: false });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLElement).getAttribute("id");

    if (id === "mapper-close") {
      closeModal();
    }

    const isInput = (e.target as HTMLElement).tagName.toLowerCase() === "input";
    if (!isInput) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = tooltipPoint.x + e.movementX;
      const newY = tooltipPoint.y + e.movementY;
      setTooltipPoint({ x: newX, y: newY });
    }
  };

  const openDeleteModal = () => {
    setShowDelete(true);
  };

  const handleDeleteClose = () => {
    setShowDelete(false);
  };
  const handleDelete = async () => {
    setListLoader(false);
    closeModal();
    handleDeleteClose();

    const itemData = claimedItemsList.filter(
      (item: any) => Number(item.itemNumber) === Number(selectedMappedItem.itemNumber)
    );
    if (itemData[0]?.replaceItems) {
      const payload = {
        id: itemData[0]?.replaceItems[0]?.id,
        parentId: selectedMappedItem.itemId,
      };
      const result = await deleteMappedLineItem(payload, token);
      if (result) {
        const claimedResp: any = getClaimedItems(
          {
            claimId: claimId,
            reqForReceiptMapper: true,
          },
          token
        );
        if (claimedResp.status === 200) {
          addClaimedItemsListData({ claimedData: claimedResp });
        }
        addNotification({
          message: "Item Deleted Successfully",
          id: "map_delete_success",
          status: "success",
        });
      } else {
        addNotification({
          message: "Something Went Wrong",
          id: "map_delete_error",
          status: "error",
        });
      }
      addSelectedMappPoint({ selectedMappedItem: {} });
    }
    setListLoader(true);
  };

  return (
    <>
      <div className="p-3">
        <div className="row col-12">
          <div className={`${receiptMapperStyle.fileNameDiv} col-md-7 col-7 `}>
            <b>{translate?.receiptMapperTranslate?.claimedItems?.fileName}</b>
            <div>{selectedPdf?.fileName}</div>
          </div>
          <div
            className={`${receiptMapperStyle.zoombuttonDiv} col-md-5 col-5 text-right`}
          >
            <div>
              <ImPriceTags size="25" onClick={() => handleOpenTag(selectedPdf.pdfId)} />
            </div>
            <div onClick={handleZoomIn}>
              <RiZoomInFill size="25" />
            </div>
            <div onClick={handleZoomOut}>
              <RiZoomOutFill size="25" />
            </div>
          </div>
        </div>
        <div className={receiptMapperStyle.pdfRelativeContainer}>
          <PdfViewer
            fileUrl={selectedPdf?.fileUrl}
            handlePointClick={handlePointClick}
            scale={scale}
            pdfCustomClassname={receiptMapperStyle.receiptPdfPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />

          {modalIsOpen && (
            <div
              className="position-absolute"
              style={{
                left: `${tooltipPoint.x}px`,
                top: `${tooltipPoint.y}px`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              <MapperPopup
                openDeleteModal={openDeleteModal}
                pageNumber={pageNumber}
                offsetX={tooltipPoint.x}
                offsetY={tooltipPoint.y}
                closeModal={closeModal}
                setListLoader={setListLoader}
              />
            </div>
          )}
          {!modalIsOpen && mappedPoints && (
            <div
              className={receiptMapperStyle.editPoint}
              style={{
                left: `${selectedMappedItem.offsetX}px`,
                top: `${selectedMappedItem.offsetY}px`,
              }}
            >
              <div
                className={receiptMapperStyle.editIcon}
                role="button"
                onClick={() => {
                  if (selectedMappedItem.holdOverPaid === 0) {
                    handlePointClickEdit(
                      selectedMappedItem.offsetX,
                      selectedMappedItem.offsetY
                    );
                  } else {
                    addNotification({
                      message: `'SETTLED' status mapped item #${selectedMappedItem.itemNumber} can not be Edited!`,
                      id: "setted_edit_error",
                      status: "error",
                    });
                  }
                }}
              >
                <RiFileEditFill size="30px" fill="#33aae5" />
              </div>
              <div className={receiptMapperStyle.itemContainer}>
                <div className={receiptMapperStyle.itemdiv}>
                  {selectedMappedItem.itemNumber}
                </div>
                <div className={receiptMapperStyle.itemdiv}>
                  {getUSDCurrency(selectedMappedItem.receiptValue)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showDelete && (
        <div className={receiptMapperStyle.modalpopup}>
          <ConfirmModal
            showConfirmation={true}
            closeHandler={handleDeleteClose}
            submitBtnText={translate?.receiptMapperTranslate?.claimedItems?.yes}
            closeBtnText={translate?.receiptMapperTranslate?.claimedItems?.no}
            childComp={translate?.receiptMapperTranslate?.claimedItems?.dltPopupMsg}
            modalHeading={translate?.receiptMapperTranslate?.claimedItems?.deleteMapping}
            submitHandler={handleDelete}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  selectedPdf: state.receiptMapper.selectedPdf,
  selectedMappedItem: state.receiptMapper.selectedMappedItem,
  claimedItemsList: state.claimedItems.claimedItemsList,
  token: selectAccessToken(state),
});

const mapDispatchToProps = {
  addSelectedMappPoint,
  setmapperOpen,
  addNotification,
  addClaimedItemsListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(RecieptMapperPdfViewer);
