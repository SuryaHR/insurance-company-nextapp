import React, { useState, useEffect } from "react";
import ConversationModalStyle from "./ConversationModal.module.scss";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import Modal from "@/components/common/ModalPopups";
import { RiFileInfoLine } from "react-icons/ri";
import ConversationModalForm from "./ConversationModalForm";
import {
  getItemComments,
  addItemComment,
} from "@/services/_adjuster_services/ClaimContentListService";
import CustomLoader from "../CustomLoader";
import { connect } from "react-redux";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";

import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

function ConversationModal(props: any) {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const { isOpen, onClose, itemRowData, addNotification } = props;
  const [commentsList, setCommentsList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);

  const handleLoader = () => {
    setShowLoader((prevState) => !prevState);
  };
  useEffect(() => {
    const getConversationList = async () => {
      const payload = {
        item: {
          itemUID: itemRowData?.itemUID,
          itemId: itemRowData?.itemId,
        },
      };
      handleLoader();
      const commentsData = await getItemComments(payload);
      handleLoader();
      if (commentsData?.status === 200) {
        setCommentsList(commentsData.data);
      } else {
        addNotification({
          message: commentsData.errorMessage,
          id: "mark_comments_data_failure",
          status: "error",
        });
      }
    };
    getConversationList();
  }, [addNotification, itemRowData]);

  const constructFormData = (data: any) => {
    const formData = new FormData();
    if (selectedFile && selectedFile.length > 0) {
      selectedFile.map((file: any) => {
        formData.append("file", file);
      });
      formData.append("mediaFilesDetail", JSON.stringify(data?.docs));
    } else {
      formData.append("file", "null");
      formData.append("mediaFilesDetail", "null");
    }

    const payload = {
      comment: data.comment,
      item: {
        itemUID: itemRowData?.itemUID,
        itemId: itemRowData?.itemId,
      },
      commentedBy: { id: props.id },
    };
    formData.append("commentData", JSON.stringify(payload));
    return formData;
  };

  const handleConversarionSubmit = async (data: any) => {
    handleLoader();
    const formData = constructFormData(data);
    const res = await addItemComment(formData);
    setSelectedFile([]);
    handleLoader();

    if (res?.status === 200) {
      setCommentsList(res.data);
    } else {
      props.addNotification({
        message: res.errorMessage,
        id: "failure",
        status: "error",
      });
    }
  };

  return (
    <>
      {showLoader && <CustomLoader />}

      <Modal
        isOpen={isOpen}
        iconComp={<RiFileInfoLine />}
        headingName={translate?.addItemModalTranslate?.conversationModal?.conversation}
        onClose={onClose}
        childComp={
          <ConversationModalForm
            commentsList={commentsList}
            handleConversarionSubmit={handleConversarionSubmit}
            id={props.id}
            setSelectedFile={setSelectedFile}
          />
        }
        overlayClassName={ConversationModalStyle.modalContainer}
        modalWidthClassName={ConversationModalStyle.modalContent}
      />
    </>
  );
}
const mapStateToProps = (state: any) => ({
  id: selectLoggedInUserId(state),
});
const mapDispatchToProps = {
  addNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConversationModal);
