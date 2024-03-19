"use client";
import AdjusterPropertyClaimDetailComponent from "@/components/_adjuster_components/AdjusterPropertyClaimDetailComponent";
interface propsTypes {
  claimId: string;
}
const AdjusterPropertyClaimDetailContainer: React.FC<propsTypes> = ({ claimId }) => {
  return (
    <>
      <AdjusterPropertyClaimDetailComponent claimId={claimId} />
    </>
  );
};
export default AdjusterPropertyClaimDetailContainer;
