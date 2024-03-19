"use client";
import React, { useCallback, useEffect, useState } from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import styles from "./ActivityLog.module.scss";
import GenericButton from "@/components/common/GenericButton";
import Modal from "@/components/common/ModalPopups";
import AddActivityPopup from "./AddActivityPopup";
import AssignmentActivityLog from "./AssignmentActivityLog";
import {
  getActivityLogData,
  downloadActivityLogData,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import Image from "next/image";
import scrollToTopImg from "@/assets/images/scrollToTop.png";
import CustomLoader from "@/components/common/CustomLoader";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

function ActivityLog() {
  const [AssignmentActivityLogData, setAssignmentActivityLogData] = useState([]);
  const claimId = sessionStorage.getItem("claimId") || "";
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const init = useCallback(async () => {
    setIsLoader(true);
    const res = await getActivityLogData({ claimId });
    setAssignmentActivityLogData(res.data);
    setAssignmentActivityLogData(res.data);
    setIsLoader(false);
  }, [claimId]);

  useEffect(() => {
    init();
  }, [init]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const addLoader = () => {
    setIsLoader(true);
  };

  const removeLoader = () => {
    setIsLoader(false);
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
    const content = await downloadActivityLogData({ claimId });
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
        <GenericComponentHeading
          title={translate?.adjusterPropertyClaimActivityLog?.activitylog?.heading}
        />
        <div className={styles.buttonRowContainer}>
          <GenericButton
            label={
              translate?.adjusterPropertyClaimActivityLog?.activitylog?.buttons
                ?.addActivity
            }
            onClick={openModal}
            size="small"
          />
          <GenericButton
            onClick={handleGeneratePdf}
            label={
              translate?.adjusterPropertyClaimActivityLog?.activitylog?.buttons
                ?.downloadAsPdf
            }
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
        headingName={
          translate?.adjusterPropertyClaimActivityLog?.activitylog?.addActivityPopup
            ?.heading
        }
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
