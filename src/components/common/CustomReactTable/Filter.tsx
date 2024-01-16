"use client";
import React, { useState } from "react";
import { RiFilter2Fill } from "react-icons/ri";
import GenericButton from "../GenericButton/index";
import CustomReactTableStyles from "./CustomReactTable.module.scss";
import { Tooltip } from "react-tooltip";

export default function Filter({
  column,
  table,
  showFilterBLock,
  setShowFilterBLock,
  defaultAllChecked = true,
  filterFn,
  customFilterValues,
}: {
  column: React.SetStateAction<any>;
  table: React.SetStateAction<any>;
  showFilterBLock: React.SetStateAction<string | null>;
  setShowFilterBLock: React.SetStateAction<any>;
  defaultAllChecked: React.SetStateAction<boolean | undefined>;
  filterFn: React.SetStateAction<any | null>;
  customFilterValues: React.SetStateAction<any | null>;
}) {
  const [currentValue, setCurrentValue] = React.useState<React.SetStateAction<any>>([]);
  const [sortedUniqueValuesFirst, setSortedUniqueValuesFirst] = React.useState<
    React.SetStateAction<any>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] =
    React.useState<React.SetStateAction<any>>(false);
  // const [preCheckedValue, setPreCheckedValue] =
  // React.useState<React.SetStateAction<boolean>>(false);

  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );
  const priceRanges = [
    { label: "$0.00 - $24.99", value: "$0.00 - $24.99" },
    { label: "$25.00 - $99.99", value: "$25.00 - $99.99" },
    { label: "$100.00 - $999.99", value: "$100.00 - $999.99" },
    { label: "$1,000.00+", value: "$1,000.00+" },
  ];
  React.useEffect(() => {
    console.log(sortedUniqueValuesFirst);
    if (typeof firstValue !== "number") {
      if (
        defaultAllChecked &&
        sortedUniqueValues &&
        sortedUniqueValuesFirst.length === 0
      ) {
        const uniqueValues = sortedUniqueValues.map((row) => {
          return row === null || row === undefined ? "BLANK" : row;
        });
        setCurrentValue(uniqueValues);
        setSortedUniqueValuesFirst(uniqueValues);
      }
    } else {
      if (defaultAllChecked && priceRanges && sortedUniqueValuesFirst.length === 0) {
        const uniqueValues = priceRanges.map((row) => {
          return row.value;
        });
        setCurrentValue(uniqueValues);
        setSortedUniqueValuesFirst(uniqueValues);
      }
    }
  }, [sortedUniqueValues]);

  const handleFilterIconClick = (columnId: any) => {
    setIsOpen(!isOpen);

    if (showFilterBLock === columnId) {
      setShowFilterBLock(null);
    } else {
      setShowFilterBLock(columnId);
    }
  };
  const handleChecked = (e: { target: { value: React.SetStateAction<any> } }) => {
    const checked = currentValue.filter((item: string) => item === e.target.value);

    if (checked.length > 0) {
      setCurrentValue((current: any) =>
        current.filter((item: string) => {
          return item !== e.target.value;
        })
      );
    } else {
      setCurrentValue([...currentValue, e.target.value]);
    }
    // column.setFilterValue([...currentValue, e.target.value]);
  };

  const handlePriceCheckboxChange = (value: any) => {
    let updatedPrices = [...currentValue];

    if (updatedPrices.includes(value)) {
      updatedPrices = updatedPrices.filter((price) => price !== value);
    } else {
      updatedPrices.push(value);
    }
    setCurrentValue(updatedPrices);
  };
  const handleSubmit = () => {
    if (filterFn) {
      filterFn(currentValue, column.id, typeof firstValue);
    }
    setIsOpen(!isOpen);
    setShowFilterBLock(null);
  };
  const isChecked = (checkedValue: string) => {
    const checked = currentValue.filter((item: string) => item === checkedValue);

    if (checked.length != 0) {
      return true;
    }
    return false;
  };
  const handleSelectAll = () => {
    if (customFilterValues) {
      if (customFilterValues.length !== currentValue.length) {
        const custArr: any = [];
        customFilterValues.map((item: any) => {
          custArr.push(item.name);
        });
        setCurrentValue(custArr);
      } else {
        setCurrentValue([]);
      }
    } else {
      if (typeof firstValue !== "number") {
        if (sortedUniqueValuesFirst.length !== currentValue.length) {
          const custArr: any = [];
          sortedUniqueValuesFirst.map((item: any) => {
            custArr.push(item);
          });
          setCurrentValue(custArr);
        } else {
          setCurrentValue([]);
        }
      } else {
        if (priceRanges.length !== currentValue.length) {
          const custArr: any = [];
          priceRanges.map((item: any) => {
            custArr.push(item.value);
          });
          setCurrentValue(custArr);
        } else {
          setCurrentValue([]);
        }
      }
    }
  };
  React.useEffect(() => {
    if (customFilterValues) {
      if (customFilterValues.length !== currentValue.length) {
        setIsSelectAllChecked(false);
      } else {
        setIsSelectAllChecked(true);
      }
    } else {
      if (typeof firstValue !== "number") {
        if (sortedUniqueValuesFirst.length !== currentValue.length) {
          setIsSelectAllChecked(false);
        } else {
          setIsSelectAllChecked(true);
        }
      } else {
        if (priceRanges.length !== currentValue.length) {
          setIsSelectAllChecked(false);
        } else {
          setIsSelectAllChecked(true);
        }
      }
    }
  }, [currentValue]);

  return (
    <div className="position-relative">
      <Tooltip
        anchorSelect={`#${column.id}list`}
        place="top"
        style={{
          backgroundColor: "white",
          color: "black",
          padding: "0px",
          zIndex: "999",
          boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
        noArrow={true}
        hidden={!isOpen}
        openOnClick={true}
        clickable={true}
      >
        <div className={CustomReactTableStyles.filterPopUp} id={column.id + "listelemnt"}>
          <div className={CustomReactTableStyles.filterHeader}>
            <input
              type="checkbox"
              className={CustomReactTableStyles.filterCheckBox}
              id="selectAll"
              name="selectAll"
              value="all"
              onChange={handleSelectAll}
              checked={isSelectAllChecked}
            />
            <label> Select All</label>
          </div>
          <div className={CustomReactTableStyles.filterContents}>
            {typeof firstValue === "number" ? (
              <>
                {priceRanges.map((range) => (
                  <div
                    key={range.value}
                    className={CustomReactTableStyles.filterContainer}
                  >
                    <input
                      type="checkbox"
                      className={CustomReactTableStyles.filterCheckBox}
                      value={range.value}
                      checked={currentValue.includes(range.value)}
                      onChange={() => handlePriceCheckboxChange(range.value)}
                    />
                    {range.label}
                  </div>
                ))}
              </>
            ) : (
              <>
                {filterFn && customFilterValues ? (
                  <>
                    {customFilterValues
                      .slice(0, 5000)
                      .map((value: any, index: number) => (
                        <div
                          className={CustomReactTableStyles.filterContainer}
                          key={index}
                        >
                          <input
                            type="checkbox"
                            className={CustomReactTableStyles.filterCheckBox}
                            id="selectAll"
                            name="selectAll"
                            value={value.name}
                            onChange={handleChecked}
                            checked={isChecked(value.name)}
                          />
                          {value.name ?? "BLANK"}
                        </div>
                      ))}
                  </>
                ) : (
                  <>
                    {sortedUniqueValuesFirst
                      .slice(0, 5000)
                      .map((value: any, index: number) => (
                        <div
                          className={CustomReactTableStyles.filterContainer}
                          key={index}
                        >
                          <input
                            type="checkbox"
                            className={CustomReactTableStyles.filterCheckBox}
                            id="selectAll"
                            name="selectAll"
                            value={value ?? "BLANK"}
                            onChange={handleChecked}
                            checked={isChecked(value ?? "BLANK")}
                          />
                          {value ?? "BLANK"}
                        </div>
                      ))}
                  </>
                )}
              </>
            )}
          </div>
          <div className={CustomReactTableStyles.actionButtons}>
            <a
              onClick={() => {
                setIsOpen(!isOpen);
                setShowFilterBLock(null);
              }}
            >
              Cancel
            </a>
            <GenericButton
              label="OK"
              theme="lightBlue"
              size="small"
              type="submit"
              onClickHandler={handleSubmit}
            />
          </div>
        </div>
      </Tooltip>

      <div
        id={`${column.id}list`}
        onClick={() => handleFilterIconClick(column.id)}
        className={CustomReactTableStyles.filterIcon}
      >
        <RiFilter2Fill color="#337ab7" size="20px" />
      </div>
    </div>
  );
}
