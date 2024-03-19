const translate = {
  adjusterDashboard: {
    myScoreBoardCrads: {
      myScored: "My Scorecard",
      scoreBoardComponent: {
        thisMonth: "This Month",
        thisQuarter: "This Quarter",
        thisYear: "This Year",
        scoreCardComponent: {
          newClaims: "New Claims",
          closedClaims: "Closed Claims",
          avgClosingTime: "Avg. Closing Time",
        },
      },
    },
    AlterTabsButton: {
      Notifications: " Notifications",
      Messages: "Messages",
      DashBoardNotification: {
        notificationDeleted: "Notification Deleted.",
        somethingWentWrong: "Something went wrong.",
      },
      MessageAlertCards: {
        notificationDeletedCards: "Notification Deleted.",
        somethingWentWrongCards: "Something went wrong.",
      },
    },
    ClaimsNeedAttention: {
      claimNeedingAttenttion: "Claims Needing Attention",
      ClaimsComponent: {
        days: "days",
        items: "items",
        overDue: " Over Due",
        toClose: " To close",
        ClaimsAllViewButton: {
          viewAllUrgentClaims: " View All Urgent Claims ",
        },
      },
      NoRecordComponent: {
        message: "No records available",
      },
    },
    PendingVendorCards: {
      pendingVendorInvoices: "Pending Vendor Invoices ",
      NoRecordComponent: {
        message: "No records available",
      },
      PendingComponent: {
        payArtigemContent: "Pay Artigem Contents",
        forClaim: "for claim #",
        ViewAllButtonPending: {
          viewAllPendingClaims: "View All Pending Claims",
        },
      },
    },
    OpenClaimsTableComponent: {
      OpenClaimsText: {
        OpenClaims: "Open Claims",
      },
      NewClaimButton: {
        newCliam: "New Claim",
      },
    },
  },
};

export { translate };

export type adjusterDashboardTranslateType = typeof translate;
