"use client";
import React from "react";
import Styles from "./receiptMapperPdfList.module.scss";
import { ImPriceTags } from "react-icons/im";
import { ConnectedProps, connect } from "react-redux";
import GenericButton from "@/components/common/GenericButton/index";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  addMappedlineitems,
  addSelectedFile,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { useParams } from "next/navigation";
import { getMappedlineitems } from "@/services/_core_logic_services/CoreReceiptMapperService";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";

interface typeProps {
  [key: string | number]: any;
}
const ReceiptMapperPdfList: React.FC<connectorType & typeProps> = (props) => {
  const dispatch = useAppDispatch();
  const { claimId } = useParams();

  const {
    receiptMapperPdfList,
    setPdfViewer,
    setListLoader,
    handleOpenTag,
    addMappedlineitems,
    token,
  }: React.SetStateAction<any> = props;
  return (
    <div className={Styles.container}>
      {receiptMapperPdfList?.map(
        (data: { date: any; pdfList: any }, index: React.Key | null | undefined) => {
          return (
            <div key={index}>
              <div className={Styles.date}>{data.date}</div>
              {data.pdfList.map(
                (
                  item: { name: string; url: string; pdfId: number; tags: any },
                  itemIndex: React.Key | null | undefined
                ) => {
                  return (
                    <div key={itemIndex} className={Styles.padfName}>
                      <div className={Styles.subDiv}>
                        <div>
                          <GenericButton
                            label={item.name}
                            theme="linkBtn"
                            onClickHandler={async () => {
                              setListLoader(true);
                              const mappedItemsList = await getMappedlineitems(
                                { claimId },
                                token
                              );
                              if (mappedItemsList.status === 200) {
                                addMappedlineitems({
                                  mappedlineitemsList: mappedItemsList,
                                });
                              }
                              dispatch(
                                addSelectedFile({
                                  selectedPdf: {
                                    fileUrl: item.url,
                                    fileName: item.name,
                                    pdfId: item.pdfId,
                                  },
                                })
                              );
                              setPdfViewer(true);
                              setListLoader(false);
                            }}
                          />
                        </div>

                        <div>
                          <ImPriceTags
                            size="20"
                            className={Styles.priceTags}
                            onClick={() => {
                              handleOpenTag(item.pdfId);
                            }}
                          />
                        </div>
                      </div>
                      <div className={Styles.tagContainer}>
                        {item.tags &&
                          item.tags.map((tagItem: any) => (
                            <div key={tagItem.id} className={Styles.pdfTags}>
                              {tagItem.tag}
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          );
        }
      )}
      {(receiptMapperPdfList === null || receiptMapperPdfList.length < 1) && (
        <div className={Styles.padfName}>
          <div className={Styles.noPdfText}>No Recipt found...</div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  receiptMapperPdfList: state.receiptMapper.receiptMapperPdfList,
  token: selectAccessToken(state),
});
const mapDispatchToProps = {
  addMappedlineitems,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ReceiptMapperPdfList);
