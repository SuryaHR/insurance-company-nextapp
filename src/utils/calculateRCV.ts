import { parseFloatWithFixedDecimal } from "./utitlity";

export const setItemLimitDetailsFromHOPolicyType = (
  ItemDetails: any,
  policyInfo: any
) => {
  if (policyInfo.categories) {
    const categorySpecCovDet = policyInfo.categories.filter(
      (policyCategory: any) => policyCategory.name === ItemDetails.category.name
    );
    if (categorySpecCovDet) {
      ItemDetails.individualLimitAmount = categorySpecCovDet[0]
        ? categorySpecCovDet[0].individualItemLimit
        : 0;
    }
  }
};

const CalculateRCVWithSplCase = function (
  ItemDetails: any,
  subcategory: any,
  price: any
) {
  let ACV = 0;
  let depriciationAmt = 0;
  const maxDepreciationAmt = price * (subcategory.maxDepreciation / 100);
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

  ItemDetails.subcategory = subcategory;
  if (subcategory.specialCase) {
    if (subcategory.depreciation) {
      let ageInYrs = ItemDetails.ageYears + ItemDetails.ageMonths / 12;
      if (ageInYrs > 0) {
        let depreciatedPrice = price;
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
        "% year on";
    } else if (subcategory.flatDepreciation && subcategory.flatDepreciation > 0) {
      depriciationAmt = parseFloatWithFixedDecimal(
        price * (subcategory.flatDepreciation / 100)
      );
      ACV = price - depriciationAmt;
      ItemDetails.depriciationRateStr = subcategory.flatDepreciation + "% flat";
    } else {
      let ageInYrs = ItemDetails.ageYears;
      ageInYrs = ItemDetails.ageYears + ItemDetails.ageMonths / 12;
      let depreciatedPrice = price;
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
    }
  } else {
    let ageInYrs = ItemDetails.ageYears + ItemDetails.ageMonths / 12;
    let depreciatedPrice = price;
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
  }

  ItemDetails.depreciationAmount = parseFloatWithFixedDecimal(depriciationAmt);
  ItemDetails.acv = parseFloatWithFixedDecimal(ACV);

  //CTB-3151
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

// Content List RCV Calculation
export const CalculateRCV = (ItemDetails: any, SubCategoryList: any) => {
  const acceptingStandardCost = true;
  const isReplaced = true;

  let price: number = 0.0;
  let taxRate: number = 0.0;
  let ACV: number = 0.0;
  let RCV: number = 0.0;

  price = acceptingStandardCost ? ItemDetails.rcv : ItemDetails.totalStatedAmount;

  RCV = price ? parseFloat(price.toString()) : 0;

  /**Calculate material cost**/
  if (isReplaced || ItemDetails.replaced) {
    price = parseFloatWithFixedDecimal(ItemDetails.rcv * ItemDetails.replacementQty);
  }

  taxRate = ItemDetails.taxRate && ItemDetails.applyTax == true ? ItemDetails.taxRate : 0;
  ItemDetails.totalTax = parseFloatWithFixedDecimal(
    (taxRate / 100) * (isNaN(price) ? 1 : price)
  );

  price = isNaN(price) ? 0 : parseFloatWithFixedDecimal(ItemDetails.totalTax + price);
  ItemDetails.rcvTotal = parseFloatWithFixedDecimal(price);
  if (SubCategoryList && ItemDetails.subCategory && ItemDetails.subCategory.id) {
    const subcategory = SubCategoryList.find(
      (x: any) => x.id == ItemDetails.subCategory.id
    );
    if (subcategory) CalculateRCVWithSplCase(ItemDetails, subcategory, price);
  }

  ACV = parseFloatWithFixedDecimal(price - ItemDetails.depreciationAmount);
  ACV = isNaN(ACV) || ACV < 0 ? 0 : ACV;

  ItemDetails.itemOverage = 0.0;
  ItemDetails.scheduleAmount = parseFloatWithFixedDecimal(
    ItemDetails.scheduleAmount ? ItemDetails.scheduleAmount : 0.0
  );
  // CTB-2903
  // Condition where Item's category is not listed in selected home owners Policy type
  // then individual Limit will be 0.00, Item overage must also be considered 0.00.
  // Every item’s final Item Overage(holdover value) will be calculated based on the final Total Cash Value (ACV)
  // If(Total Cash Value > Item Limit) then acv - individual item limit else  Item Overage = 0.0
  if (
    ItemDetails.individualLimitAmount &&
    ItemDetails.individualLimitAmount > 0 &&
    ACV > ItemDetails.individualLimitAmount
  )
    ItemDetails.itemOverage = parseFloatWithFixedDecimal(
      ACV - ItemDetails.individualLimitAmount
    );

  ItemDetails.acv = parseFloatWithFixedDecimal(ACV);
  ItemDetails.rcv = parseFloatWithFixedDecimal(RCV);

  //ACV shld be always smaller than RCV
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
  return ItemDetails;
};
