import React, { useCallback, useContext, useEffect, useState } from "react";
import lineItemDetailComponentStyle from "./lineItemDetailComponent.module.scss";
import GroupedActionButtons from "./GroupedActionButtons";
import OrginalItemForm from "./OrginalItemForm";
import ReplacementItemSection from "./ReplacementItemSection";
import WebComparables from "./WebComparables";
import AddedComparables from "./AddedComparables";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, any, minLength, object, string } from "valibot";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import CustomComparable from "./CustomComparable";
import useBodyScrollbar from "@/hooks/useBodyScrollbar";
import Modal from "@/components/common/ModalPopups";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useParams, useRouter } from "next/navigation";
import { fetchClaimContentAction } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import AddNewMessageModalComponent from "@/components/common/AddNewMessageModalComponent";
import { capitalize } from "lodash";
import { LineItemContext } from "../LineItemContext";
import selectItemCategory from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemCategory";
import { updateLineItemStatus } from "@/reducers/_core_logic_reducers/LineItemDetail/LineItemDetailSlice";
import { getParticipantsList } from "@/services/_core_logic_services/CoreLineItemDetailService";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import {
  deleteClaimItem,
  reviewItemSupervisor,
  addMessage,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";

type participantType = { label: string; value: string };

function LineItemDetailComponentForm() {
  const router = useRouter();
  const { hideScroll, showScroll } = useBodyScrollbar();
  const dispatch = useAppDispatch();
  const lineItem = useAppSelector(
    (state) => state[EnumStoreSlice.LINE_ITEM_DETAIL]?.lineItem
  );
  const CRN = useAppSelector((state) => state.session?.CRN);
  const [openCustomComparableModal, setOpenCustomComparableModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { itemId, claimId } = useParams();
  const [showSupervisorReview, setShowSupervisorReview] = useState(false);
  const [participants, setParticipants] = useState<participantType[]>([]);
  const [defaultParticipants, setDefaultParticipants] = useState<participantType[]>([]);
  const selectedCategory = useAppSelector(selectItemCategory);
  const token = useAppSelector(selectAccessToken);

  const schema = object({
    description: string("Item description", [minLength(0)]),
    insuredPrice: any(),
    quantity: any(),
    scheduleAmount: any(),
    ageYears: any(),
    ageMonths: any(),
    brand: any(),
    model: any(),
  });

  useEffect(() => {
    if (openCustomComparableModal || confirmDelete) {
      hideScroll();
    } else {
      showScroll();
    }
    return () => showScroll();
  }, [openCustomComparableModal, confirmDelete, hideScroll, showScroll]);

  const defaultValue = {
    description: lineItem?.description,
    insuredPrice: lineItem?.insuredPrice,
    quantity: lineItem?.quantity,
    scheduleAmount: lineItem?.scheduleAmount,
    ageYears: lineItem?.ageYears,
    ageMonths: lineItem?.ageMonths,
    brand: lineItem?.brand,
    model: lineItem?.model,
  };

  const { register, handleSubmit, control, formState, getValues, setValue } =
    useCustomForm(schema, defaultValue);
  console.log("Error>>", formState.errors);

  const handleFormSubmit = (data: Output<typeof schema>) => {
    console.log("Submit data>>>>", data);
    setShowLoader(true);
    contextSave();
  };

  const closeCustomComparable = () => {
    setOpenCustomComparableModal(false);
  };

  // Delete item
  const showDeleteModal = () => setConfirmDelete(true);
  const closeDeleteModal = () => setConfirmDelete(false);

  const handleDeleteItem = async () => {
    const { id, itemUID, claimId } = lineItem;

    const res = await deleteClaimItem({ id, itemUID }, token);

    if (res) {
      dispatch(
        addNotification({
          message: res ?? "Successfully deleted item.",
          id: new Date().valueOf(),
          status: "success",
        })
      );
      dispatch(fetchClaimContentAction({ claimId: claimId.toString() }));
      router.replace(`/adjuster-property-claim-details/${claimId}`);
    } else {
      dispatch(
        addNotification({
          message: "Something went wrong.",
          id: new Date().valueOf(),
          status: "error",
        })
      );
    }
    closeDeleteModal();
  };

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await getParticipantsList(+itemId, token);
      if (res?.status === 200) {
        const optionsArray = res?.data?.map((participant: any) => {
          const companyName = participant?.companyDTO?.companyName
            ? `${participant?.companyDTO?.companyName} - `
            : "";
          const filteredData = {
            label: `${participant?.firstName} ${participant?.lastName} (${companyName}${capitalize(
              participant?.role
            )})`,
            value: JSON.stringify({ participant }),
          };
          if (participant.role === "CLAIM SUPERVISOR") {
            setDefaultParticipants([filteredData]);
          }
          return filteredData;
        });
        setParticipants(optionsArray);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      setParticipants([]);
    }
  }, [itemId, token]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const statusChangeToUnderReview = async (addMessageResp: any) => {
    const payload = {
      itemUID: lineItem?.itemUID,
    };
    const res = await reviewItemSupervisor(payload, token);
    if (res?.status === 200) {
      dispatch(
        addNotification({
          message: addMessageResp.message,
          id: new Date().valueOf(),
          status: "success",
        })
      );
      dispatch(updateLineItemStatus({ status: res?.data?.status ?? null }));
    } else {
      dispatch(
        addNotification({
          message: addMessageResp.message ?? "Something went wrong.",
          id: new Date().valueOf(),
          status: "error",
        })
      );
    }
  };
  const constructFormData = (data: any) => {
    const participantsArray: any = [];
    let internal = true;
    let registration = null;
    data?.participants.map((participant: { value: string }) => {
      const prsedObj = JSON.parse(participant?.value);
      if (
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "EXTERNAL" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "EXISTING VENDOR" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "NEW VENDOR" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "CLAIM ASSOCIATE" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "CLAIM REPRESENTATIVE" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "GEMLAB ASSOCIATE"
      ) {
        internal = false;
        registration = prsedObj.vendorRegistration;
        participantsArray.push({
          participantId: prsedObj?.participant?.participantId,
          email: prsedObj?.participant?.emailId,
          vendorRegistration: prsedObj ? prsedObj?.participant?.vendorRegistration : null,
          participantType: { ...prsedObj?.participant?.participantType },
        });
      } else {
        participantsArray.push({
          participantId: prsedObj?.participant?.participantId,
          email: prsedObj?.participant?.emailId,
          participantType: { ...prsedObj?.participant?.participantType },
        });
      }
    });
    const payload = {
      claimId,
      claimNumber: lineItem?.claimNumber,
      sender: CRN,
      itemUID: null,
      serviceRequestNumber: null,
      isPublicNote: false,
      message: data?.message,
      isInternal: internal,
      registrationNumber: registration,
      groupDetails: {
        groupId: null,
        groupTitle: null,
        participants: participantsArray,
      },
    };
    const formData = new FormData();
    let mediaFileDetailsArray: any = [];
    if (data?.files.length > 0) {
      data?.files?.map((fileObj: any) => {
        const newObj = {
          fileName: fileObj?.name,
          fileType: fileObj?.type,
          extension: fileObj?.name.substr(fileObj?.name.lastIndexOf(".")),
          filePurpose: "Note",
          latitude: null,
          longitude: null,
        };
        mediaFileDetailsArray.push(newObj);
        formData.append("file", fileObj);
      });
    } else {
      formData.append("file", "null");
      mediaFileDetailsArray = null;
    }

    formData.append("mediaFilesDetail", JSON.stringify(mediaFileDetailsArray));
    formData.append("noteDetail", JSON.stringify(payload));
    return formData;
  };

  const handleMessageSubmit = async (data: any) => {
    const formData = constructFormData(data);
    const addMessageResp = await addMessage(formData, token);
    toggleSupervisorModal();
    if (addMessageResp?.status === 200) {
      statusChangeToUnderReview(addMessageResp);
    } else {
      dispatch(
        addNotification({
          message: addMessageResp.message ?? "Something went wrong.",
          id: new Date().valueOf(),
          status: "error",
        })
      );
    }
  };

  const { rapidDivRef, setShowLoader, categoryRef, subCategoryRef, contextSave } =
    useContext(LineItemContext);

  const toggleSupervisorModal = () => {
    setShowSupervisorReview(!showSupervisorReview);
  };

  return (
    <>
      <Modal
        isOpen={showSupervisorReview}
        onClose={toggleSupervisorModal}
        headingName={"Add new message"}
        childComp={
          <AddNewMessageModalComponent
            handleOpenModal={toggleSupervisorModal}
            claimId={claimId.toString()}
            participants={participants}
            handleMessageSubmit={handleMessageSubmit}
            defaultValue={defaultParticipants}
          />
        }
        positionTop={true}
        animate={true}
        overlayClassName={lineItemDetailComponentStyle.modalContainer}
        modalWidthClassName={lineItemDetailComponentStyle.modalContent}
      />
      <Modal
        isOpen={confirmDelete}
        onClose={closeDeleteModal}
        headingName="Delete Lost/Damaged Item"
        overlayClassName={lineItemDetailComponentStyle.deleteModalOverlay}
        footerContent={
          <div className={lineItemDetailComponentStyle.deleteModalBtn}>
            <GenericButton label="No" theme="linkBtn" onClickHandler={closeDeleteModal} />
            <GenericButton label="Yes" size="small" onClickHandler={handleDeleteItem} />
          </div>
        }
        childComp={
          <p className={lineItemDetailComponentStyle.deleteModalMessage}>
            Are you sure you want to delete this item? <strong>Please Confirm!</strong>
          </p>
        }
        animate
        positionTop
        roundedBorder
      />
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={lineItemDetailComponentStyle.root}
      >
        <CustomComparable
          closeCustomComparable={closeCustomComparable}
          openCustomComparableModal={openCustomComparableModal}
        />

        <GroupedActionButtons onDeleteClick={showDeleteModal} />
        <div className={lineItemDetailComponentStyle.topItemSection}>
          <div ref={rapidDivRef} style={{ position: "absolute", top: 0 }} />
          <OrginalItemForm
            register={register}
            control={control}
            getValues={getValues}
            setValue={setValue}
          />
          <ReplacementItemSection
            showCustomComparableModal={() => {
              if (!selectedCategory?.category && !selectedCategory?.subCategory) {
                if (categoryRef?.current) {
                  categoryRef.current.focus();
                }
                dispatch(
                  addNotification({
                    message: "Please select category and subcategory",
                    id: new Date().valueOf(),
                    status: "warning",
                  })
                );
              } else if (!selectedCategory?.subCategory) {
                if (subCategoryRef?.current) {
                  subCategoryRef.current.focus();
                }
                dispatch(
                  addNotification({
                    message: "Please select subcategory",
                    id: new Date().valueOf(),
                    status: "warning",
                  })
                );
              } else setOpenCustomComparableModal(true);
            }}
          />
        </div>
        <div className={lineItemDetailComponentStyle.bottomItemSection}>
          <WebComparables />
          <AddedComparables />
        </div>
      </form>
    </>
  );
}

export default LineItemDetailComponentForm;
