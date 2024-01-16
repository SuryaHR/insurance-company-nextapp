import AdjusterAssignServiceRequestComponent from "@/components/AdjusterAssignServiceRequestComponent/index";

interface propsTypes {
  serviceRequestId: string;
}
const AdjusterAssignServiceRequestContainer: React.FC<propsTypes> = async ({
  serviceRequestId,
}) => {
  return (
    <>
      <AdjusterAssignServiceRequestComponent serviceRequestId={serviceRequestId} />
    </>
  );
};
export default AdjusterAssignServiceRequestContainer;
