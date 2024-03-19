"use-client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import GenericButton from "@/components/common/GenericButton";
import Style from "./addLabelModalComponent.module.scss";
import {
  addTag,
  deleteTag,
  tagGetApi,
} from "@/services/_adjuster_services/ReceiptMapper/ReceiptMapperService";
import { RiCloseCircleFill } from "react-icons/ri";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import GenericNormalInput from "../GenericInput/GenericNormalInput";

interface AddLabelModalComponentProps {
  closeTagModel: () => void;
  pdfId: number;
}
const AddLabelModalComponent: React.FC<AddLabelModalComponentProps> = (props: any) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { closeTagModel, pdfId } = props;
  const [value, setValue] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const [tagsList, setTagsList] = useState([]);

  const hasApiCalledRef = useRef(false);

  const getTags = (params: any) => {
    tagGetApi(params)
      .then((res) => {
        if (res.data) {
          setTagsList(res.data);
        }
      })

      .catch((error) => console.log("tag api error", error));
  };
  useEffect(() => {
    if (!hasApiCalledRef.current) {
      hasApiCalledRef.current = true;
      const params = {
        pdfId: pdfId,
      };
      getTags(params);
    }
  }, [pdfId]);

  const handleBlur = (e: { target: { value: any } }) => {
    if (value === "") {
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
        tag: value,
      },
    ];
    addTag(params).then(() => {
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
    deleteTag(params).then(() => {
      getTags({ pdfId: pdfId });
    });
  };
  return (
    <div>
      <form>
        <div className="row">
          <div className="col-lg-10">
            <GenericNormalInput
              placeholder={
                translate?.receiptMapperTranslate?.claimedItems?.newLabelPholder
              }
              onChange={(e: any) => handleInputChange(e)}
              onBlur={(e: any) => handleBlur(e)}
              value={value}
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

export default AddLabelModalComponent;
