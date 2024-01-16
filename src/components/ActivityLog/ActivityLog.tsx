"use client";
import React, { useEffect, useState } from "react";
import styles from "./ActivityLog.module.scss";
import GenericComponentHeading from "../common/GenericComponentHeading/index";
import GenericButton from "@/components/common/GenericButton";
import Modal from "@/components/common/ModalPopups";
import AddActivityPopup from "./AddActivityPopup";
import AssignmentActivityLog from "./AssignmentActivityLog";
import {
  getActivityLogData,
  downloadActivityLogData,
} from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { adjusterPropertyClaimActivityLogType } from "@/translations/adjusterPropertyClaimActivityLog/en";
import Image from "next/image";
import scrollToTopImg from "@/assets/images/scrollToTop.png";
import CustomLoader from "@/components/common/CustomLoader";
import useTranslation from "@/hooks/useTranslation";

function ActivityLog() {
  const [AssignmentActivityLogData, setAssignmentActivityLogData] = useState([]);
  const claimId = sessionStorage.getItem("claimId") || "";
  const { translate }: { translate: adjusterPropertyClaimActivityLogType | any } =
    useTranslation("adjusterPropertyClaimActivityLog");
  const payload = {
    claimId: claimId,
  };
  let res: any;

  const init = async () => {
    setIsLoader(true);
    res = await getActivityLogData(payload);
    setAssignmentActivityLogData(res.data);
    setAssignmentActivityLogData(res.data);
    setIsLoader(false);
  };

  useEffect(() => {
    init();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const addLoader = () => {
    setIsModalOpen(true);
  };

  const removeLoader = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
    setIsModalOpen(false);
    init();
  };

  const groupedData: any = AssignmentActivityLogData.reduce(
    (acc: { [x: string]: any[] }, obj: { createdDate: any }) => {
      const date = obj.createdDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(obj);
      return acc;
    },
    {}
  );
  const groupedArray = Object.entries(groupedData);
  const ContentView = groupedArray.map((obj: any, i: React.Key | null | undefined) => {
    return (
      <div key={i}>
        <AssignmentActivityLog translate={translate} groupedObjData={obj} />
      </div>
    );
  });

  const handleGeneratePdf = async () => {
    const content = await downloadActivityLogData(payload);
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ActivityLog.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.activityLog}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <div className={styles.heading}>
        <GenericComponentHeading title={translate?.heading} />
        <div className={styles.buttonRowContainer}>
          <GenericButton
            className={styles.buttonCss}
            label={translate?.buttons?.addActivity}
            onClick={openModal}
            size="small"
          />
          <GenericButton
            onClick={handleGeneratePdf}
            className={styles.buttonCss}
            label={translate?.buttons?.downloadAsPdf}
            size="small"
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={
          <AddActivityPopup
            translate={translate}
            handleOpenModal={handleOpenModal}
            addLoader={addLoader}
            removeLoader={removeLoader}
          />
        }
        headingName={translate?.addActivityPopup?.heading}
        modalWidthClassName={styles.modalWidth}
      ></Modal>
      <div className="row">{ContentView}</div>
      <span className={styles.scrollToTop}>
        {/* <Image onClick={scrollToTop} style={{ height: "40px", width: "60px" }} alt="scrollTop" "> */}
        <Image
          onClick={scrollToTop}
          src={scrollToTopImg}
          alt="Go to top"
          style={{ height: "40px", width: "60px" }}
        />
      </span>
    </div>
  );
}

export default ActivityLog;
