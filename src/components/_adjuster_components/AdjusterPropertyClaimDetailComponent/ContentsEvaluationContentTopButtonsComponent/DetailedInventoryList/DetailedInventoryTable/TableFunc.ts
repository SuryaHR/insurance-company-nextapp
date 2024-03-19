export interface SubCategory {
  name: string;
  depreciation?: boolean;
  specialCase?: boolean;
  firstYearDepreciation?: string;
  correspondYearDepreciation?: string;
  annualDepreciation?: string;
  maxDepreciation?: string;
  flatDepreciation?: string;
}

export interface Item {
  replacementItemDescription: string | null | any;
  subcategoryDetails?: {
    name: string;
  };
}

export function getDepreciationRate(
  item: Item,
  subCategoriesData: SubCategory[]
): string {
  if (item.replacementItemDescription != null) {
    let depreciationRate = "0.00%";
    const subCategory = subCategoriesData.find(
      (sub) => sub.name == item.subcategoryDetails?.name
    );
    if (subCategory) {
      if (subCategory.depreciation) {
        if (subCategory.specialCase && subCategory.name != "Ring") {
          depreciationRate =
            `${subCategory.firstYearDepreciation}%` +
            ", " +
            `${subCategory.correspondYearDepreciation}% year on`;
        } else {
          depreciationRate = `${subCategory.annualDepreciation}%`;
        }
        depreciationRate += ", " + `${subCategory.maxDepreciation}% max`;
      } else if (subCategory.flatDepreciation) {
        depreciationRate = `${subCategory.flatDepreciation}% flat`;
      } else {
        depreciationRate = `${subCategory.annualDepreciation}%`;
        if (!(subCategory.specialCase && subCategory.depreciation == false)) {
          depreciationRate += ", " + `${subCategory.maxDepreciation}% max`;
        }
      }
    }
    return depreciationRate;
  }
  return "0.00%";
}
