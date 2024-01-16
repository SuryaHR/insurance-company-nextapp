import AdjusterServiceRequest from "@/components/AdjusterServiceRequest";

interface propsTypes {
  claimId: string;
}
const AdjusterServiceRequestContainer: React.FC<propsTypes> = async ({ claimId }) => {
  return (
    <>
      <AdjusterServiceRequest claimId={claimId} />
    </>
  );
};
export default AdjusterServiceRequestContainer;
