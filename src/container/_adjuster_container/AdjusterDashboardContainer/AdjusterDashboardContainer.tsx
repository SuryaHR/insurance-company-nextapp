import AdjusterDashboardComponent from "@/components/_adjuster_components/AdjusterDashboardComponent";

function AdjusterDashboardContainer(props: { translate: any }) {
  const { translate } = props;
  return (
    <>
      <AdjusterDashboardComponent translate={translate} />
    </>
  );
}
export default AdjusterDashboardContainer;
