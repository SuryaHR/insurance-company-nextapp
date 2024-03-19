"use client";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import AllClaimMessagesComponentStyle from "./AllClaimMessagesComponent.module.scss";
import NewMessageComponent from "./NewMessageComponent";
import ChatComponent from "./ChatComponent";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";

interface propsTypes {
  claimId: string | null;
  handleOpenModal: () => void;
  init: () => void;
  noteId?: any;
}

const AllClaimMessagesComponent: React.FC<propsTypes & connectorType> = ({
  claimId,
  notes,
  notesFull,
  handleOpenModal,
  init,
  noteId,
}) => {
  const [width, setWidth] = useState({ size: 70, iconChange: false });
  const [activeMessageWindow, setActiveMessageWindow] = useState<any>(0);

  const divEnlarge = () => {
    width?.size === 70
      ? setWidth({ size: 95, iconChange: true })
      : setWidth({ size: 70, iconChange: false });
  };

  const SwitchMessageBoxCont = useCallback(
    (index: any) => {
      setActiveMessageWindow(index);
      if (noteId) {
        sessionStorage.removeItem("noteId");
      }
    },
    [noteId]
  );

  const findIndexOfNoteId = useCallback(
    (messages: any) => {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].noteId === parseInt(noteId)) {
          return i;
        }
      }
      return -1;
    },
    [noteId]
  );

  useEffect(() => {
    notesFull.forEach((obj: any, index: any) => {
      const indexWithNoteId4042 = findIndexOfNoteId(obj.messages);
      if (indexWithNoteId4042 !== -1) {
        SwitchMessageBoxCont(index);
      }
    });
  }, [SwitchMessageBoxCont, findIndexOfNoteId, notesFull]);

  return (
    <div className={AllClaimMessagesComponentStyle.container}>
      <div className={AllClaimMessagesComponentStyle.newMessageCont}>
        <NewMessageComponent
          init={init}
          handleOpenModal={handleOpenModal}
          SwitchMessageBoxCont={SwitchMessageBoxCont}
          claimId={claimId}
        />
      </div>
      <div
        className={AllClaimMessagesComponentStyle.chatCont}
        style={{ width: `${width?.size + "%"}` }}
      >
        <ChatComponent
          init={init}
          data={
            notes !== notesFull
              ? notes[activeMessageWindow]
              : notesFull[activeMessageWindow]
          }
          divEnlarge={divEnlarge}
          iconChange={width?.iconChange}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notesParticipants: state.allNotes.notesParticipants,
  notesFull: state.allNotes.notesFull,
  notes: state.allNotes.notes,
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AllClaimMessagesComponent);
