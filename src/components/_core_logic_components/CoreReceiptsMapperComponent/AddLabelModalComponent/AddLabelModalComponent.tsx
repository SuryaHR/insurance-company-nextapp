"use-client";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import GenericButton from "@/components/common/GenericButton";
import Style from "./addLabelModalComponent.module.scss";
import { RiCloseCircleFill } from "react-icons/ri";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import { RootState } from "@/store/store";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import { ConnectedProps, connect } from "react-redux";
import {
  addTag,
  deleteTag,
  tagGetApi,
} from "@/services/_core_logic_services/CoreReceiptMapperService";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface AddLabelModalComponentProps {
  closeTagModel: () => void;
  pdfId: number;
}
const AddLabelModalComponent: React.FC<AddLabelModalComponentProps & connectorType> = (
  props: any
) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { closeTagModel, pdfId, token } = props;
  const [currValue, setValue] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const [tagsList, setTagsList] = useState([]);

  const hasApiCalledRef = useRef(false);

  const getTags = useCallback(
    (params: any) => {
      tagGetApi(params, token)
        .then((res) => {
          if (res.data) {
            setTagsList(res.data);
          }
        })

        .catch((error) => console.log("tag api error", error));
    },
    [token]
  );
  useEffect(() => {
    if (!hasApiCalledRef.current) {
      hasApiCalledRef.current = true;
      const params = {
        pdfId: pdfId,
      };
      getTags(params);
    }
  }, [pdfId, getTags]);

  const handleBlur = (e: { target: { value: any } }) => {
    if (currValue === "") {
      setIsBlurred(true);
    } else if (e.target.value) {
      setIsBlurred(false);
    }
  };

  const handleInputChange = (event: { target: { value: any } }) => {
    setValue(event.target.value);
  };
  const handleGetTag = () => {
    const params = [
      {
        pdfId: pdfId,
        tag: currValue,
      },
    ];
    addTag(params, token).then(() => {
      getTags({ pdfId: pdfId });
      closeTagModel();
    });
  };
  const handleDeleteTag = (id: number) => {
    const params = [
      {
        id: id,
      },
    ];
    deleteTag(params, token).then(() => {
      getTags({ pdfId: pdfId });
    });
  };
  return (
    <div>
      <form>
        <div className="row">
          <div className="col-lg-10">
            <GenericNormalInput
              value={currValue}
              placeholder={
                translate?.receiptMapperTranslate?.claimedItems?.newLabelPholder
              }
              onBlur={(e: any) => handleBlur(e)}
              onChange={(e: any) => handleInputChange(e)}
            />
            {isBlurred && <p className={Style.error}>Please enter label.. !</p>}
          </div>
          <div className="col-lg-2 mt-2">
            <GenericButton
              label={translate?.receiptMapperTranslate?.claimedItems?.add}
              size="small"
              disabled={isBlurred}
              onClick={() => handleGetTag()}
            />
          </div>
        </div>
        <div className="d-flex flex-row mt-2">
          {tagsList.map((item: any) => (
            <div key={item.id} className={Style.tagList}>
              {item.tag}
              <RiCloseCircleFill
                size="20"
                fill="#cc4848"
                id="mapper-close"
                onClick={() => handleDeleteTag(item.id)}
              />
            </div>
          ))}
        </div>
        <div className="row">
          <div className={"col-lg-10"} />
          <div className={"col-lg-2 mt-5 justify-content-end"}>
            <GenericButton
              label={translate?.receiptMapperTranslate?.claimedItems?.close}
              size="medium"
              onClick={closeTagModel}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: selectAccessToken(state),
});
const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;

export default connector(AddLabelModalComponent);
