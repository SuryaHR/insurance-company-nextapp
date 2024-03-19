import { TypedMenuObject } from "@/components/common/Navbar/NavbarComponent";

export const adminMenu: TypedMenuObject[] = [
  {
    label: "Company",
    link: "/company",
    pathList: ["company"],
  },
  {
    label: "3rd Party Vendors",
    link: "",
    dropdown: [{ link: "", label: "Contracted Vendors" }],
  },
  {
    label: "Settings",
    link: "",
    dropdown: [
      {
        link: "",
        label: "Environment Settings",
        dropdown: [
          {
            link: "",
            label: "Content Categories",
          },
          { link: "", label: "Claim Forms" },
          { link: "", label: "Home Owner's Policies" },
          { link: "", label: "Email Template" },
          { link: "", label: "Content Services" },
          { link: "", label: "Service Requests" },
          {
            link: "",
            label: "Policyholder Portal Settings",
          },
        ],
      },
      { link: "", label: "Report Settings" },
    ],
  },
  {
    label: "Business Rules",
    link: "",
    dropdown: [
      { link: "", label: "Roles And Budgets" },
      { link: "", label: "Payment Terms" },
      { link: "", label: "Payment Options" },
      { link: "", label: "State Taxes" },
      { link: "", label: "Roles And Permission" },
      { link: "", label: "Claims" },
    ],
  },
  {
    label: "User Administration",
    pathList: ["users"],
    link: "",
    dropdown: [
      { link: "/users", label: "Users" },
      { link: "", label: "Departments" },
      { link: "", label: "Security Controls" },
    ],
  },
];
