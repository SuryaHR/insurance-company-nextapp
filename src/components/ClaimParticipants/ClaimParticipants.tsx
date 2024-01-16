import React, { useState } from "react";
import Cards from "@/components/common/Cards";
import { FaUserCircle } from "react-icons/fa";
import GenericComponentHeading from "../common/GenericComponentHeading/index";
import { SlEnvolope } from "react-icons/sl";
import Modal from "@/components/common/ModalPopups";
import styles from "./ClaimParticipants.module.scss";
import { IconContext } from "react-icons";
import AddNewMsgModalComponent from "../common/AddNewMessageModalComponent/AddNewMessageModalComponent";

interface type {
  claimId: string;
}

const ClaimParticipants: React.FC<type> = (props) => {
  const { claimId } = props;
  const [isOpen, setIsOpen] = useState(false);
  const data = [1, 2, 3];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageSubmit = () => {};

  return (
    <div className={styles.claimParticipants}>
      <div className={styles.heading}>
        <GenericComponentHeading title={"Claim Participants"} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={
          <AddNewMsgModalComponent
            handleOpenModal={handleOpenModal}
            handleMessageSubmit={handleMessageSubmit}
            claimId={claimId}
            participants={[]}
          />
        }
        headingName="Add new message"
        modalWidthClassName={styles.modalWidth}
      ></Modal>
      <div className="row">
        {data.map((item, i) => (
          <div className={styles.claimCards} key={i}>
            <Cards>
              <div className={styles.participantsCardContainer}>
                <IconContext.Provider value={{ className: styles.useCircle }}>
                  <FaUserCircle />
                </IconContext.Provider>
                <div className={styles.name}>{item}Gregory, Rafael</div>
                <div className={styles.companyName}>Evolution</div>
                <div className={styles.role}>Claim Supervisor</div>
                <div className={styles.contactDetails}>
                  <div className={styles.phone}>(565) -656-5656</div>
                  <div className={styles.mail}>
                    <button className={styles.mail} onClick={openModal}>
                      <IconContext.Provider value={{ className: styles.ciMail }}>
                        <SlEnvolope />
                      </IconContext.Provider>
                    </button>
                  </div>
                </div>
              </div>
            </Cards>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClaimParticipants;
