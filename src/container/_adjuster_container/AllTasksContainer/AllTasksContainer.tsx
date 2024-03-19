import AllTasksComponent from "@/components/_adjuster_components/AllTasksComponent";

interface propsTypes {
  claimId: string;
}

const AllTasksContainer: React.FC<propsTypes> = async ({ claimId }) => {
  // const claimId = claimId;

  // const payload = {
  //   claimId: claimId,
  // };
  // console.log("claimId ====> ", claimId);
  return (
    <>
      <AllTasksComponent claimId={claimId} />
    </>
  );
};

export default AllTasksContainer;
