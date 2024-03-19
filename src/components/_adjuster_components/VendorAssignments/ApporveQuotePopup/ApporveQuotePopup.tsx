"use-client";
import React from "react";
import { useState } from "react";
import modalStyle from "./ApporveQuotePopup.module.scss";
import GenericButton from "@/components/common/GenericButton";
import { approveQuote } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { connect } from "react-redux";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";

interface AddActivityPopupProps {
  handleOpenModal: () => void;
  addLoader: () => void;
  removeLoader: () => void;
  translate: any;
  participantsList: any;
  quoteViewData: any;
}

const ApporveQuotePopup: React.FC<AddActivityPopupProps> = ({
  handleOpenModal,
  addLoader,
  removeLoader,
  quoteViewData,
}) => {
  const [note, setNote] = useState<any>("");
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const handleChange = (event: any) => {
    setNote(event.target.value);
    if (!event.target.value || event.target.value.trim() === "") {
      setNote(event.target.value);
      setDisabledButton(true);
      return;
    } else if (event.target.value) {
      setNote(event.target.value);
      setDisabledButton(false);
    }
  };

  const acceptQuote = async () => {
    addLoader();
    quoteViewData.quoteStatus["id"] = 2;
    quoteViewData["approvedMessage"] = note;
    quoteViewData.quoteStatus["status"] = "APPROVED";
    const response: any = await approveQuote(quoteViewData);

    if (response?.status == 200 && response?.data) {
      dispatch(
        addNotification({
          message: response?.message,
          id: "approve_quote_success",
          status: "success",
        })
      );
      removeLoader();
      handleOpenModal();
    } else {
      dispatch(
        addNotification({
          message: response?.message,
          id: "approve_quote_error",
          status: "error",
        })
      );
      removeLoader();
    }
  };

  return (
    <div className={modalStyle.formCont}>
      <form>
        <div className="p-2 row">
          <label className={modalStyle.labelText}>
            Please enter a note to confirm that you accept the replacement quote.
          </label>
          <textarea
            className={modalStyle.textareaNoteFiels}
            onChange={handleChange}
            name="note"
            id="note"
            cols={30}
            placeholder="Note to Artigem"
            rows={10}
          />
        </div>
        <div className={`${modalStyle.alignRight} row col-12 mt-2`}>
          <div className={modalStyle.buttonContStyle}>
            <GenericButton
              className={modalStyle.buttonStyle}
              label={"Cancel"}
              size="medium"
              onClick={handleOpenModal}
            />
            <GenericButton
              disabled={disabledButton}
              className={modalStyle.buttonStyle}
              label={"Accept Quote"}
              size="medium"
              onClick={acceptQuote}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ commonData }: any) => ({
  participantsList: commonData.participants,
});
const connector = connect(mapStateToProps, {});

export default connector(ApporveQuotePopup);
