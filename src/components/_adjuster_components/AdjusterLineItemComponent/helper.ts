import { unknownObjectType } from "@/constants/customTypes";
import store from "@/store/store";
import { parseFloatWithFixedDecimal } from "@/utils/utitlity";

const constants = {
  itemStatus: {
    created: "CREATED",
    assigned: "ASSIGNED",
    underReview: "UNDER REVIEW",
    valued: "VALUED",
    approved: "APPROVED",
    settled: "SETTLED",
    replaced: "REPLACED",
    workInProgress: "WORK IN PROGRESS",
    paid: "PAID",
    partialReplaced: "PARTIAL REPLACED",
  },
};

const CalculateRCVWithSplCase = (
  subcategory: unknownObjectType,
  Price: number,
  lineItem: unknownObjectType
) => {
  const ItemDetails = lineItem;
  let ACV = 0;
  let depriciationAmt = 0;
  const maxDepreciationAmt = parseFloatWithFixedDecimal(
    Price * (subcategory.maxDepreciation / 100)
  );
  ItemDetails.ageYears = Number.isNaN(Number(ItemDetails.ageYears))
    ? 0
    : ItemDetails.ageYears;
  ItemDetails.ageMonths = Number.isNaN(Number(ItemDetails.ageMonths))
    ? 0
    : ItemDetails.ageMonths;
  const depreciationRate =
    subcategory.annualDepreciation * (ItemDetails.ageYears + ItemDetails.ageMonths / 12);
  ItemDetails.depreciationRate = depreciationRate;
  ItemDetails.depriciationRateStr = subcategory.annualDepreciation + "%";
  ItemDetails.subCategory = subcategory;

  if (subcategory.specialCase) {
    if (subcategory.depreciation) {
      let ageInYrs = ItemDetails.ageYears + ItemDetails.ageMonths / 12;
      if (ageInYrs > 0) {
        let depreciatedPrice = Price;
        if (ageInYrs < 1) {
          depriciationAmt +=
            depreciatedPrice * ((subcategory.firstYearDepreciation / 100) * ageInYrs);
          depreciatedPrice =
            depreciatedPrice -
            depreciatedPrice * (subcategory.firstYearDepreciation / 100) * ageInYrs;
        } else {
          depriciationAmt += depreciatedPrice * (subcategory.firstYearDepreciation / 100);
          depreciatedPrice =
            depreciatedPrice -
            depreciatedPrice * (subcategory.firstYearDepreciation / 100);
        }
        ageInYrs = ageInYrs - 1; //after fst yr depreciation
        while (ageInYrs > 0) {
          if (ageInYrs < 1) {
            depriciationAmt +=
              depreciatedPrice *
              ((subcategory.correspondYearDepreciation / 100) * ageInYrs);
            depreciatedPrice =
              depreciatedPrice -
              depreciatedPrice *
                ((subcategory.correspondYearDepreciation / 100) * ageInYrs);
            ageInYrs = ageInYrs - 1;
          } else {
            depriciationAmt +=
              depreciatedPrice * (subcategory.correspondYearDepreciation / 100);
            depreciatedPrice =
              depreciatedPrice -
              depreciatedPrice * (subcategory.correspondYearDepreciation / 100);
            ageInYrs = ageInYrs - 1;
          }
        }
        ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(
          ItemDetails.rcvTotal - depreciatedPrice
        );
        ACV = parseFloatWithFixedDecimal(
          ItemDetails.rcvTotal - ItemDetails.depreciationAmount
        );
      }

      ItemDetails.depriciationRateStr =
        subcategory.firstYearDepreciation +
        "%, " +
        subcategory.correspondYearDepreciation +
        "% year on, " +
        subcategory.maxDepreciation +
        "% max";
    } else if (subcategory.flatDepreciation && subcategory.flatDepreciation > 0) {
      depriciationAmt = parseFloatWithFixedDecimal(
        Price * (subcategory.flatDepreciation / 100)
      );
      ACV = Price - depriciationAmt;
      ItemDetails.depriciationRateStr = subcategory.flatDepreciation + "% flat";
    } else {
      let ageInYrs = ItemDetails.ageYears;
      ageInYrs = ItemDetails.ageYears + ItemDetails.ageMonths / 12;
      let depreciatedPrice = Price;
      while (ageInYrs > 0) {
        if (ageInYrs < 1) {
          depriciationAmt +=
            depreciatedPrice * ((subcategory.annualDepreciation / 100) * ageInYrs);
          depreciatedPrice =
            depreciatedPrice -
            depreciatedPrice * (subcategory.annualDepreciation / 100) * ageInYrs;
        } else {
          depriciationAmt += depreciatedPrice * (subcategory.annualDepreciation / 100);
          depreciatedPrice =
            depreciatedPrice - depreciatedPrice * (subcategory.annualDepreciation / 100);
        }
        ageInYrs = ageInYrs - 1;
      }
      ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(
        ItemDetails.rcvTotal - depreciatedPrice
      );
      ACV = parseFloatWithFixedDecimal(
        ItemDetails.rcvTotal - ItemDetails.depreciationAmount
      );

      ItemDetails.depriciationRateStr += ", " + subcategory.maxDepreciation + "% max";
    }
  } else {
    let ageInYrs = ItemDetails.ageYears + ItemDetails.ageMonths / 12;
    // depriciationAmt = Price * (subcategory.annualDepreciation / 100);
    let depreciatedPrice = Price;
    //  = Price - depriciationAmt;
    // ageInYrs = ageInYrs-1;//after fst yr depreciation
    while (ageInYrs > 0) {
      if (ageInYrs < 1) {
        depriciationAmt +=
          depreciatedPrice * ((subcategory.annualDepreciation / 100) * ageInYrs);
        depreciatedPrice =
          depreciatedPrice -
          depreciatedPrice * (subcategory.annualDepreciation / 100) * ageInYrs;
      } else {
        depriciationAmt += depreciatedPrice * (subcategory.annualDepreciation / 100);
        depreciatedPrice =
          depreciatedPrice - depreciatedPrice * (subcategory.annualDepreciation / 100);
      }
      ageInYrs = ageInYrs - 1;
    }
    ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(
      ItemDetails.rcvTotal - depreciatedPrice
    );
    ACV = parseFloatWithFixedDecimal(
      ItemDetails.rcvTotal - ItemDetails.depreciationAmount
    );

    ItemDetails.depriciationRateStr += ", " + subcategory.maxDepreciation + "% max";
  }

  ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(depriciationAmt);
  ItemDetails.acv = parseFloatWithFixedDecimal(ACV);

  if (
    ItemDetails.condition &&
    ItemDetails.condition.conditionId &&
    (subcategory.flatDepreciation > 0 ||
      ItemDetails.ageYears > 0 ||
      ItemDetails.ageMonths > 0)
  ) {
    if (ItemDetails.condition.conditionId === 1) {
      ItemDetails.acv = ItemDetails.acv * 1.1;
    } else if (ItemDetails.condition.conditionId === 2) {
      ItemDetails.acv = ItemDetails.acv * 1.05;
    } else if (ItemDetails.condition.conditionId === 4) {
      ItemDetails.acv = ItemDetails.acv * 0.9;
    }
  }

  if (ItemDetails.acv > 0) {
    ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(
      ItemDetails.rcvTotal - ItemDetails.acv
    );
    ItemDetails.depreciationAmount =
      ItemDetails.depreciationAmount < 0 ? 0 : ItemDetails.depreciationAmount;
    if (ItemDetails.depreciationAmount > maxDepreciationAmt && maxDepreciationAmt > 0) {
      ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(maxDepreciationAmt);
      ItemDetails.acv = ItemDetails.rcvTotal - ItemDetails.depreciationAmount;
    }
  } else {
    if (
      ItemDetails.isReplaced &&
      ItemDetails.depreciationAmount > 0 &&
      maxDepreciationAmt &&
      maxDepreciationAmt > 0
    ) {
      ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(maxDepreciationAmt);
      ItemDetails.acv = ItemDetails.rcvTotal - ItemDetails.depreciationAmount;
    } else {
      ItemDetails.depreciationAmount = 0;
      ItemDetails.acv = ItemDetails.rcvTotal;
    }
  }
  return ItemDetails;
};

export const calculateRCV = (
  lineItem: unknownObjectType,
  //   subCategory: unknownObjectType
  replacementItem?: unknownObjectType | null,
  acceptedStandardCost?: boolean
) => {
  let ItemDetails: unknownObjectType = Object.assign({}, lineItem);
  // let acceptedStandardCost = false;
  if (!replacementItem && replacementItem !== null) {
    const state = store.getState();
    replacementItem = state.lineItemDetail?.replacementItem;
    // acceptedStandardCost = state.lineItemDetail?.acceptedStandardCost;
    if (
      ItemDetails.isReplaced &&
      (ItemDetails.status.status == "VALUED" ||
        ItemDetails.status.status == "PARTIAL REPLACED" ||
        ItemDetails.status.status == "PAID" ||
        ItemDetails.status.status == "REPLACED" ||
        ItemDetails.status.status == "SETTLED")
    ) {
      ItemDetails.replacementQty = ItemDetails.replacementQty
        ? ItemDetails.replacementQty
        : ItemDetails.quantity;
      acceptedStandardCost = true;
    }
  }

  if (ItemDetails && ItemDetails.isReplaced) {
    let previousValue =
      ItemDetails.insuredPrice && ItemDetails.rcvTotal ? ItemDetails.insuredPrice : 0;
    let Price = 0.0;
    let taxRate = 0.0;
    let ACV = 0.0;
    let RCV = 0.0;

    // const acceptedStandardCost = true;

    Price = acceptedStandardCost ? ItemDetails.rcv : ItemDetails.totalStatedAmount;

    ItemDetails.replacementQty = Number(ItemDetails.replacementQty) || 1;
    ItemDetails.individualLimitAmount = parseFloatWithFixedDecimal(
      ItemDetails.homeInsurancePolicyCategoryLimits?.individualItemLimit ??
        ItemDetails.individualLimitAmount
    );

    let isCustom = false;
    let customCharges = 0.0;
    let laborCharges = 0.0;
    let itemReplace = false;

    if (replacementItem) {
      if (replacementItem.isReplacementItem == true && !replacementItem.isDelete) {
        Price = parseFloat(
          replacementItem.unitPrice ? replacementItem.unitPrice : replacementItem.price
        );
        itemReplace = true;
        isCustom = replacementItem.customItem;
        laborCharges = replacementItem.labourCharges
          ? replacementItem.labourCharges
          : 0.0;
        customCharges = replacementItem.customCharges
          ? replacementItem.customCharges
          : 0.0;
      }
    } else if (
      ItemDetails.status.status === constants.itemStatus.valued ||
      ItemDetails.status.status === constants.itemStatus.replaced ||
      ItemDetails.status.status === constants.itemStatus.paid ||
      ItemDetails.status.status === constants.itemStatus.settled
    ) {
      Price = parseFloatWithFixedDecimal(ItemDetails.rcv);
    }
    if (!itemReplace) {
      if (previousValue) {
        Price = parseFloat(ItemDetails.insuredPrice ? ItemDetails.insuredPrice : 0);
        previousValue = Price;
      }
    }

    ItemDetails.ageMonths = +ItemDetails.ageMonths;
    ItemDetails.ageYears = +ItemDetails.ageYears;
    RCV = Price;
    if (ItemDetails.isReplaced) {
      Price = parseFloatWithFixedDecimal(
        ItemDetails.replacedItemPrice * ItemDetails.replacementQty
      );
    }

    taxRate =
      ItemDetails.taxRate && ItemDetails.applyTax == true ? ItemDetails.taxRate : 0;
    ItemDetails.totalTax = parseFloatWithFixedDecimal(
      (taxRate / 100) * (isNaN(Price) ? 1 : Price)
    );
    Price = isNaN(Price) ? 0 : parseFloatWithFixedDecimal(ItemDetails.totalTax + Price);

    if (isCustom) {
      Price += laborCharges + customCharges;
    }
    ItemDetails.rcvTotal = parseFloatWithFixedDecimal(Price);
    if (ItemDetails?.subCategory) {
      ItemDetails = CalculateRCVWithSplCase(ItemDetails?.subCategory, Price, ItemDetails);
    }

    ACV = parseFloatWithFixedDecimal(Price - ItemDetails.depreciationAmount);
    ACV = isNaN(ACV) || ACV < 0 ? 0 : ACV;
    ItemDetails.scheduleAmount = parseFloatWithFixedDecimal(
      ItemDetails.scheduleAmount ? ItemDetails.scheduleAmount : 0.0
    );

    if (
      ItemDetails.individualLimitAmount &&
      ItemDetails.individualLimitAmount > 0 &&
      ACV > ItemDetails.individualLimitAmount
    )
      ItemDetails.itemOverage = ACV - ItemDetails.individualLimitAmount;

    ItemDetails.acv = parseFloatWithFixedDecimal(ACV);
    ItemDetails.rcv = parseFloatWithFixedDecimal(RCV);

    if (ItemDetails.acv > ItemDetails.rcvTotal) {
      ItemDetails.acv = ItemDetails.rcvTotal;
    }

    if (isNaN(ItemDetails.valueOfItem)) {
      ItemDetails.valueOfItem = 0;
    }
    if (isNaN(ItemDetails.itemOverage)) {
      ItemDetails.itemOverage = 0;
    }
    if (isNaN(ItemDetails.totalTax)) {
      ItemDetails.totalTax = 0;
    }
    if (isNaN(ItemDetails.acv)) {
      ItemDetails.acv = 0;
    }
    if (isNaN(ItemDetails.rcv)) {
      ItemDetails.rcv = 0;
    }
    if (isNaN(ItemDetails.rcvTax)) {
      ItemDetails.rcvTax = 0;
    }
    if (isNaN(ItemDetails.rcvTotal)) {
      ItemDetails.rcvTotal = 0;
    }
    if (isNaN(ItemDetails.acvTotal)) {
      ItemDetails.acvTotal = 0;
    }
    if (isNaN(ItemDetails.acvTax)) {
      ItemDetails.acvTax = 0;
    }
  }
  return ItemDetails;
};
