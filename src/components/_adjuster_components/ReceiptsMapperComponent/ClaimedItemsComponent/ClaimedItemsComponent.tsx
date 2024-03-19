"use client";
import React, { useEffect, useRef, useState } from "react";
import receiptMapperStyle from "../receiptMapperComponent.module.scss";
import clsx from "clsx";
import {
  getClaimedItems,
  getReceiptMapperDate,
} from "@/services/_adjuster_services/ReceiptMapper/ReceiptMapperService";
import ClaimedItemsTable from "./LeftSection/ClaimedItemsTable/ClaimedItemsTable";
import ClaimedItemsSearchBox from "./LeftSection/ClaimedItemsSearchBox/ClaimedItemsSearchBox";
import GenericButton from "@/components/common/GenericButton/index";
import RecieptMapperMainComponent from "./RightSection/RecieptMapperMainComponent/RecieptMapperMainComponent";
import CategorySelectList from "../CategorySelectList";
import { useParams } from "next/navigation";
import {
  addClaimedItemsKeyWord,
  setSelectedCategory,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import {
  addSelectedFile,
  addSelectedMappPoint,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { LuRefreshCw } from "react-icons/lu";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
const ClaimedItemsComponent: React.FC = () => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);
  const { claimId } = useParams();

  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const getItems = React.useCallback(async () => {
    setTableLoader(true);
    await getClaimedItems({
      claimId: claimId,
      reqForReceiptMapper: true,
    });
    await getReceiptMapperDate({
      claimId: claimId,
    });
    setTableLoader(false);
  }, [claimId]);
  const hasApiCalledRef = useRef(false);

  useEffect(() => {
    if (!hasApiCalledRef.current) {
      hasApiCalledRef.current = true;
      getItems();
    }
    return () => {
      const selectedCategory = { value: 0, label: "All" };
      dispatch(addClaimedItemsKeyWord({ searchKeyword: "" }));
      dispatch(setSelectedCategory(selectedCategory));
      dispatch(addSelectedFile({ selectedPdf: {} }));
      dispatch(addSelectedMappPoint({ selectedMappedItem: {} }));
    };
  }, [claimId, dispatch, getItems]);

  const [divEnlarge, setDivEnlarge] = useState(false);

  const divEnlargeFunc = () => {
    setDivEnlarge(!divEnlarge);
  };

  return (
    <div className="row mt-3">
      <div className="text-right mb-3">
        <LuRefreshCw
          color="#337ab7"
          className="mx-1 cursor-pointer"
          onClick={() => {
            getItems();
          }}
        />
      </div>
      <div className={clsx("pe-0", { "col-4": divEnlarge, "col-8": !divEnlarge })}>
        <div className={receiptMapperStyle.claimedItemListContainer}>
          <div className="col-3">
            <GenericButton
              btnClassname={receiptMapperStyle.clearAll}
              label={translate?.receiptMapperTranslate?.claimedItems?.ClearAllFilter}
              theme="linkBtn"
              onClickHandler={async () => {
                setTableLoader(true);
                dispatch(addClaimedItemsKeyWord({ searchKeyword: "" }));
                const selectedCategory = { value: 0, label: "All" };
                dispatch(setSelectedCategory(selectedCategory));

                await getClaimedItems({
                  claimId: claimId,
                  reqForReceiptMapper: true,
                });
                setTableLoader(false);
                setClearFilter(true);
              }}
            />
          </div>
          <div className="col-4">
            <CategorySelectList />
          </div>
          <div className="col-4">
            <ClaimedItemsSearchBox setTableLoader={setTableLoader} />
          </div>
        </div>
        <ClaimedItemsTable
          setTableLoader={setTableLoader}
          tableLoader={tableLoader}
          clearFilter={clearFilter}
          setClearFilter={setClearFilter}
        />
      </div>

      <div className={clsx("p-0", { "col-8": divEnlarge, "col-4": !divEnlarge })}>
        <RecieptMapperMainComponent
          divEnlarge={divEnlarge}
          divEnlargeFunc={divEnlargeFunc}
        />
      </div>
    </div>
  );
};

export default ClaimedItemsComponent;
