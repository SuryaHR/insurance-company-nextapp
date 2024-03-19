import { TypedMenuObject } from "@/components/common/Navbar/NavbarComponent";

export const claimSupervisorMenu: TypedMenuObject[] = [
  {
    label: "My Claims",
    link: "/supervisor-dashboard",
    pathList: ["supervisor-dashboard"],
  },
  { label: "Invoices to Approve", link: "" },
  { label: "My Team", link: "/supervisor-my-team" },
  { label: "All Claims", link: "" },
  {
    label: "Reports",
    link: "",
    dropdown: [
      { label: "Claim Reports", link: "/supervisor-claim-reports" },
      { label: "Salvage Reports", link: "/supervisor-salvage-reports" },
    ],
  },
  {
    label: "Vendor Invoices and Payments",
    link: "",
    dropdown: [
      { label: "Invoices", link: "" },
      { label: "Payments", link: "" },
    ],
  },
];
