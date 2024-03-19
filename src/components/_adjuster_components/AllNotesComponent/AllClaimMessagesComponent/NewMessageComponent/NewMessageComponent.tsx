import React, { useEffect, useState } from "react";
import NewMessageComponentStyle from "./NewMessageComponent.module.scss";
import GenericButton from "@/components/common/GenericButton";
import SearchComponent from "./SearchComponent";
import MessageComponent from "./MessageComponent";
import { LuRefreshCw } from "react-icons/lu";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import selectClaimNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimNumber";
import { capitalize } from "@/utils/helper";
import {
  addNotes,
  addNotesParticipants,
} from "@/reducers/_adjuster_reducers/AllNotes/AllNotesSlice";

type messsagesComponentType = {
  participants?: [];
  claimNumber?: string;
  CRN?: string;
  claimId: string | null;
  SwitchMessageBoxCont: (index: any) => void;
  handleOpenModal: () => void;
  init: () => void;
};

const NewMessageComponent: React.FC<connectorType & messsagesComponentType> = (
  props: any
) => {
  const participants = props.notesParticipants;
  const [notesData, setNotesData] = useState(props.notes);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setNotesData(props.notes);
  }, [props.notes]);

  const optionsArray: any = [];

  participants?.map((participant: any) => {
    const companyName = participant?.companyDTO?.companyName
      ? `${participant?.companyDTO?.companyName} - `
      : "";
    optionsArray.push({
      label: `${participant?.firstName} ${participant?.lastName} (${companyName}${capitalize(
        participant?.role
      )})`,
      value: JSON.stringify({ participant }),
    });
  });

  const refreshData = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
    props.init();
  };

  return (
    <div className={NewMessageComponentStyle.container}>
      <div className={`col-12 ${NewMessageComponentStyle.topHeader}`}>
        <div className="mx-2">
          <GenericButton
            label="New Message"
            size="small"
            onClick={props.handleOpenModal}
          />
        </div>
        <div className="mx-2">
          <LuRefreshCw
            className={`${isSpinning ? NewMessageComponentStyle.spin : ""}`}
            onClick={refreshData}
          />
        </div>
      </div>
      <div className="col-12 px-2">
        <SearchComponent searchKey={undefined} />
      </div>
      <div className={`mt-1 ${NewMessageComponentStyle.listContainer}`}>
        {notesData?.map((element: any, index: number) => (
          <div key={index} onClick={() => props.SwitchMessageBoxCont(index)}>
            <MessageComponent data={element} />
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notesParticipants: state.allNotes.notesParticipants,
  notes: state.allNotes.notes,
  claimNumber: selectClaimNumber(state),
  CRN: selectCRN(state),
});

const mapDispatchToProps = {
  addNotesParticipants,
  addNotes,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(NewMessageComponent);
