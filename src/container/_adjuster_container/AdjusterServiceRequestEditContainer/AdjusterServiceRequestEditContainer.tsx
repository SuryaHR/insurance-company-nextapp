import AdjusterServiceRequestEdit from "@/components/_adjuster_components/AdjusterServiceRequestEdit/AdjusterServiceRequestEdit";

interface propsTypes {
  serviceRequestId: string;
}
const AdjusterServiceRequestEditContainer: React.FC<propsTypes> = async ({
  serviceRequestId,
}) => {
  return (
    <>
      <AdjusterServiceRequestEdit serviceRequestId={serviceRequestId} />
    </>
  );
};
export default AdjusterServiceRequestEditContainer;
