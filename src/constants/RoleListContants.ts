const RoleListConstants = () => {
  return {
    RoleList: [
      {
        Roles: ["INSURANCE COMPANY ADMINISTRATOR", "INSURANCE ADMIN"],
        Home: "/company",
        Screens: [
          {
            URL: "/users",
          },
          {
            URL: "/users-list",
          },
          {
            URL: "/company",
          },
          {
            URL: "/new-branch",
          },
          {
            URL: "/ins-admin",
          },
          {
            URL: "/new-employee",
          },
        ],
      },
      {
        Roles: ["INSURANCE AGENT"],
        Home: "/InsuranceAgent",
        Screens: [
          {
            ScreenCode: "InsuranceAgent",
            URL: "InsuranceAgent",
          },
          {
            ScreenCode: "AllAppraisals",
            URL: "AllAppraisals",
          },
          {
            ScreenCode: "Reports",
            URL: "Reports",
          },
          {
            ScreenCode: "InsuranceReports",
            URL: "InsuranceReports",
          },
          {
            ScreenCode: "InsuranceInvoices",
            URL: "InsuranceInvoices",
          },
        ],
      },
      {
        Roles: ["COMPANY ADMIN"],
        Home: "/Company",
        Screens: [
          {
            ScreenCode: "Company",
            URL: "Company",
          },
          {
            ScreenCode: "EnvironmentSetting",
            URL: "EnvironmentSetting",
          },
          {
            ScreenCode: "RolesAndPermissionMapping",
            URL: "RolesAndPermissionMapping",
          },
          {
            ScreenCode: "UserAdministration",
            URL: "UserAdministration",
          },
          {
            ScreenCode: "Services",
            URL: "Services",
          },
          {
            ScreenCode: "StateTaxes",
            URL: "StateTaxes",
          },
          {
            ScreenCode: "RolesAndBudget",
            URL: "RolesAndBudget",
          },
          {
            ScreenCode: "PaymentTerms",
            URL: "PaymentTerms",
          },
          {
            ScreenCode: "PaymentOptions",
            URL: "PaymentOptions",
          },
          {
            ScreenCode: "ThirdPartyVendor",
            URL: "ThirdPartyVendor",
          },
          {
            ScreenCode: "VendorRegistration",
            URL: "VendorRegistration",
          },
          {
            ScreenCode: "RolesAndBudget",
            URL: "RolesAndBudget",
          },
          {
            ScreenCode: "AdminVendors",
            URL: "AdminVendors",
          },
        ],
      },
      {
        Roles: [
          "CLAIM MANAGER",
          "CLAIM CENTER ADMIN",
          "AGENT",
          "Claim Center Manager",
          "Branch Manager",
        ],
        Home: "/ManagerDashboard",
        Screens: [
          {
            ScreenCode: "ManagerDashboard",
            URL: "ManagerDashboard",
          },
          {
            ScreenCode: "ClaimCenterAllClaims",
            URL: "ClaimCenterAllClaims",
          },
          {
            ScreenCode: "ClaimSpecialistHome",
            URL: "ClaimSpecialistHome",
          },
          {
            ScreenCode: "AdjusterThirdPartyVendor",
            URL: "AdjusterThirdPartyVendor",
          },
          {
            ScreenCode: "ClaimReports",
            URL: "ClaimReports",
          },
          {
            ScreenCode: "AdjusterSalvageReports",
            URL: "AdjusterSalvageReports",
          },
          {
            ScreenCode: "BillsAndPayments",
            URL: "BillsAndPayments",
          },
          {
            URL: "/vendor-invoice-details",
          },
        ],
      },
      {
        Roles: ["ADJUSTER", "Adjuster", "Insurance Adjuster"],
        Home: "/adjuster-dashboard",
        Screens: [
          {
            URL: "/adjuster-line-item-detail/{ID}/{ID}",
          },
          {
            URL: "/claims-need-attention",
          },
          {
            URL: "/pending-vendor-invoices",
          },
          {
            URL: "/adjuster-dashboard",
          },
          {
            URL: "/adjuster-property-claim-details/{ID}",
          },
          {
            URL: "/receipts-mapper/{ID}",
          },
          {
            URL: "/bills-and-payments",
          },
          {
            URL: "/vendor-payments",
          },
          {
            URL: "/adjuster-all-claims",
          },
          {
            URL: "/claim-reports",
          },
          {
            URL: "/help-and-frequently-asked-questions",
          },
          {
            URL: "cliam-life-cycle-faq",
          },
          {
            URL: "/adjuster-salvage-reports",
          },
          {
            URL: "/new-claim",
          },
          // {
          //   URL: "/adjuster-dashboard/claims-need-attention",
          // },
          {
            URL: "/adjuster-dashboard/pending-vendor-invoices",
          },
          {
            URL: "/upload-items-from-csv",
          },
          {
            URL: "/adjuster-assign-service-request/{ID}",
          },

          {
            URL: "/adjuster-service-request-edit/{ID}",
          },

          {
            URL: "/adjuster-service-request/{ID}",
          },
          {
            URL: "/all-notes/{ID}",
          },
          {
            URL: "/all-tasks/{ID}",
          },
          {
            URL: "/user-profile",
          },
          {
            URL: "/adjuster-global-search",
          },
          {
            URL: "/people-details",
          },
          {
            URL: "/vendor-info/{ID}",
          },
          {
            URL: "/vendor-invoice-details",
          },
          {
            URL: "/view-quote/{ID}",
          },
          {
            URL: "/view-invoice/{ID}",
          },

          // core logic URL
          {
            URL: "/core-logic/core-adjuster-property-claim-details/{ID}",
          },

          {
            URL: "/core-logic/core-receipts-mapper/{ID}",
          },
          {
            URL: "/core-logic/core-adjuster-line-item-detail/{ID}/{ID}",
          },
          {
            URL: "/core-logic/upload-items-from-csv",
          },
          // end of core logic URL
        ],
      },
      {
        Roles: ["SPECIALIST", "PRICING SPECIALIST", "CLAIM SPECIALIST"],
        Home: "/AdjusterDashboard",
        Screens: [
          {
            ScreenCode: "SupervisorDashboard",
            URL: "SupervisorDashboard",
          },
          {
            ScreenCode: "SupervisorAllClaim",
            URL: "SupervisorAllClaim",
          },
          {
            ScreenCode: "ClaimSpecialistHome",
            URL: "ClaimSpecialistHome",
          },
          {
            ScreenCode: "AdjusterThirdPartyVendor",
            URL: "AdjusterThirdPartyVendor",
          },
          {
            ScreenCode: "BillsAndPayments",
            URL: "BillsAndPayments",
          },
          {
            ScreenCode: "AdjusterSalvageReports",
            URL: "AdjusterSalvageReports",
          },
        ],
      },
      {
        Roles: ["CLAIM SUPERVISOR", "Insurance Claims Supervisor"],
        Home: "/supervisor-dashboard",
        Screens: [
          // {
          //   ScreenCode: "SupervisorDashboard",
          //   URL: "SupervisorDashboard",
          // },
          // {
          //   ScreenCode: "SupervisorMyInvoices",
          //   URL: "SupervisorMyInvoices",
          // },
          // {
          //   ScreenCode: "SupervisorMyTeam",
          //   URL: "SupervisorMyTeam",
          // },
          // {
          //   ScreenCode: "SupervisorAllClaim",
          //   URL: "SupervisorAllClaim",
          // },
          // {
          //   ScreenCode: "ClaimSpecialistHome",
          //   URL: "ClaimSpecialistHome",
          // },
          // {
          //   ScreenCode: "BillsAndPayments",
          //   URL: "BillsAndPayments",
          // },
          // {
          //   ScreenCode: "ClaimReports",
          //   URL: "ClaimReports",
          // },
          // {
          //   ScreenCode: "AdjusterSalvageReports",
          //   URL: "AdjusterSalvageReports",
          // },
          {
            ScreenCode: "SupervisorDashboard",
            URL: "/supervisor-my-invoices",
          },
          {
            ScreenCode: "SupervisorMyInvoices",
            URL: "SupervisorMyInvoices",
          },
          {
            ScreenCode: "SupervisorMyTeam",
            URL: "SupervisorMyTeam",
          },
          {
            ScreenCode: "SupervisorAllClaim",
            URL: "SupervisorAllClaim",
          },
          {
            ScreenCode: "ClaimSpecialistHome",
            URL: "ClaimSpecialistHome",
          },
          {
            ScreenCode: "BillsAndPayments",
            URL: "BillsAndPayments",
          },
          {
            ScreenCode: "ClaimReports",
            URL: "ClaimReports",
          },
          {
            ScreenCode: "AdjusterSalvageReports",
            URL: "AdjusterSalvageReports",
          },
          {
            URL: "/supervisor-dashboard",
          },
          {
            URL: "/supervisor-my-team",
          },
          {
            URL: "/supervisor-claim-reports",
          },
          {
            URL: "/supervisor-salvage-reports",
          },
        ],
      },
      {
        Roles: ["UNDERWRITER", "Insurance Underwriter"],
        Home: "/UnderWriter",
        Screens: [
          {
            ScreenCode: "UnderWriterDashboard",
            URL: "UnderWriterDashboard",
          },
          {
            ScreenCode: "AllAppraisalsUnderwriter",
            URL: "AllAppraisalsUnderwriter",
          },
          {
            ScreenCode: "UnderwriterReports",
            URL: "UnderwriterReports",
          },
          {
            ScreenCode: "NewInsuranceRequests",
            URL: "NewInsuranceRequests",
          },
          {
            ScreenCode: "AutoInsuranceRequests",
            URL: "AutoInsuranceRequests",
          },
          {
            ScreenCode: "UnderwriterAutoInsuranceRequestDetails",
            URL: "UnderwriterAutoInsuranceRequestDetails",
          },
        ],
      },
      {
        Roles: ["INSURANCE ACCOUNT MANAGER"],
        Home: "/InsuranceAccountManager",
        Screens: [
          {
            ScreenCode: "InsuranceAccountManager",
            URL: "InsuranceAccountManager",
          },
          {
            ScreenCode: "InsuranceManagerReports",
            URL: "InsuranceManagerReports",
          },
          {
            ScreenCode: "InsuranceReports",
            URL: "InsuranceReports",
          },
          {
            ScreenCode: "InsuranceAccountManagerSettings",
            URL: "InsuranceAccountManagerSettings",
          },
          {
            ScreenCode: "ApplicationSettings",
            URL: "ApplicationSettings",
          },
          {
            ScreenCode: "PremiumValues",
            URL: "PremiumValues",
          },
          {
            ScreenCode: "EditPremiumValuesSettings",
            URL: "EditPremiumValuesSettings",
          },
          {
            ScreenCode: "UploadZipCodeAndPremiums",
            URL: "UploadZipCodeAndPremiums",
          },
          {
            ScreenCode: "InsuranceInvoices",
            URL: "InsuranceInvoices",
          },
        ],
      },
      {
        Roles: ["POLICYHOLDER", "INSURED"],
        Home: "/PolicyholderMyClaims",
        Screens: [
          {
            ScreenCode: "PolicyholderHome",
            URL: "PolicyholderHome",
          },
          {
            ScreenCode: "PolicyholderMyClaims",
            URL: "PolicyholderMyClaims",
          },
          {
            ScreenCode: "PolicyholderItemDetails",
            URL: "PolicyholderItemDetails",
          },
          {
            ScreenCode: "PolicyholderAddItem",
            URL: "Policyholder_Add_Item",
          },
        ],
      },
    ],
  };
};

export default RoleListConstants;
