import { TypedMenuObject } from "@/components/common/Navbar/NavbarComponent";

export const adjusterMenu: TypedMenuObject[] = [
  {
    label: "My Claims",
    // active: true,
    link: "/adjuster-dashboard",
    pathList: [
      "adjuster-dashboard",
      "adjuster-property-claim-details",
      "adjuster-line-item-detail",
      "adjuster-global-search",
      "view-quote",
      "view-invoice",
      "all-notes",
    ],
  },
  {
    label: "All Claims",
    link: "/adjuster-all-claims",
    pathList: ["adjuster-all-claims"],
  },
  {
    label: "Reports",
    pathList: ["claim-reports", "adjuster-salvage-reports"],
    dropdown: [
      { link: "/claim-reports", label: "Claims Report" },
      { link: "/adjuster-salvage-reports", label: "Slavage Report" },
    ],
  },
  {
    label: "Vendor Invoices and Payments",
    pathList: ["bills-and-payments", "vendor-payments"],
    dropdown: [
      {
        link: "/bills-and-payments",
        label: "Invoices",
      },
      {
        link: "/vendor-payments",
        label: "Payments",
      },
    ],
  },
];
