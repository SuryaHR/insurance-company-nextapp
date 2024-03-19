import InvoiceView from "@/components/_adjuster_components/VendorAssignments/InvoiceView/InvoiceView";

interface propsTypes {
  invoiceId: string;
}
const ViewInvoiceContainer: React.FC<propsTypes> = ({ invoiceId }) => {
  return (
    <>
      <InvoiceView invoiceId={invoiceId} />
    </>
  );
};

export default ViewInvoiceContainer;
