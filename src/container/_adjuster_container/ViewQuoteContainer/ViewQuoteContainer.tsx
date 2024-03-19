import QuoteView from "@/components/_adjuster_components/VendorAssignments/QuoteView/QuoteView";

interface propsTypes {
  quoteId: string;
}

const ViewQuoteContainer: React.FC<propsTypes> = async ({ quoteId }) => {
  return (
    <>
      <QuoteView quoteId={quoteId} />
    </>
  );
};

export default ViewQuoteContainer;
