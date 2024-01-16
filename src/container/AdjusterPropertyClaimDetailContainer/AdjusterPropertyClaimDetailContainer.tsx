import AdjusterPropertyClaimDetailComponent from "@/components/AdjusterPropertyClaimDetailComponent";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import {
  getCategories,
  getClaimDetailMessageList,
  getPendingTaskList,
  getSubCategories,
  getClaimItemCondition,
  getClaimItemRetailers,
  getClaimItemRoom,
  getClaimRoomTypeData,
  getClaimParticipantsList,
  getclaimContents,
  getClaimPolicyInfo,
  getClaimSettlement,
} from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { claimContentList } from "@/services/ClaimContentListService";
import { serviceRequestList } from "@/services/ClaimServiceRequestListService";
interface propsTypes {
  claimId: string;
}
const AdjusterPropertyClaimDetailContainer: React.FC<propsTypes> = async ({
  claimId,
}) => {
  const payload = {
    claimId: claimId,
  };
  const claimContentListRes: any = await claimContentList(payload);
  const serviceRequestListRes: any = await serviceRequestList(payload);
  const categoryListRes: any = await getCategories();
  const subcategoryListRes: any = await getSubCategories();
  const pendingTaskListRes: any = await getPendingTaskList(payload);
  const claimParticipantsRes: any = await getClaimParticipantsList(payload);
  const claimContentsRes: any = await getclaimContents(payload);
  const policyInfoRes: any = await getClaimPolicyInfo(payload);

  const claimDetailMessageListRes: any = await getClaimDetailMessageList({
    pageNo: 1,
    recordPerPage: PAGINATION_LIMIT_10,
    claimId,
  });
  const claimContitionRes: any = await getClaimItemCondition();
  const claimRetailerRes: any = await getClaimItemRetailers();
  const claimRoomRes: any = await getClaimItemRoom(claimId);
  const claimRoomTypeRes: any = await getClaimRoomTypeData();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ClaimSettlementRes: any = await getClaimSettlement(claimId);

  return (
    <>
      <AdjusterPropertyClaimDetailComponent
        claimId={claimId}
        claimContentListRes={claimContentListRes}
        serviceRequestListRes={serviceRequestListRes}
        categoryListRes={categoryListRes}
        subcategoryListRes={subcategoryListRes}
        pendingTaskListRes={pendingTaskListRes}
        claimDetailMessageListRes={claimDetailMessageListRes}
        claimContitionRes={claimContitionRes}
        claimRetailerRes={claimRetailerRes}
        claimRoomRes={claimRoomRes}
        claimRoomTypeRes={claimRoomTypeRes}
        claimParticipantsRes={claimParticipantsRes}
        claimContentsRes={claimContentsRes}
        policyInfoRes={policyInfoRes}
      />
    </>
  );
};
export default AdjusterPropertyClaimDetailContainer;
