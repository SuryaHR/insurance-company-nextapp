import AllNotesComponent from "@/components/_adjuster_components/AllNotesComponent";

interface propsTypes {
  claimId: string;
}
const AllNotesContainer: React.FC<propsTypes> = ({ claimId }) => {
  return (
    <>
      <AllNotesComponent claimId={claimId} />
    </>
  );
};

export default AllNotesContainer;
