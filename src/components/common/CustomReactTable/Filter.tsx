"use client";
import React, { useState } from "react";
import { RiFilter2Fill } from "react-icons/ri";
import GenericButton from "../GenericButton/index";
import CustomReactTableStyles from "./CustomReactTable.module.scss";
import { Tooltip } from "react-tooltip";
import OutsideClickHandler from "react-outside-click-handler";

export default function Filter({
  column,
  table,
  showFilterBLock,
  setShowFilterBLock,
  defaultAllChecked = true,
  filterFn,
  customFilterValues,
  clearFilter,
  customUniqueValues,
}: {
  column: React.SetStateAction<any>;
  table: React.SetStateAction<any>;
  showFilterBLock: React.SetStateAction<string | null>;
  setShowFilterBLock: React.SetStateAction<any>;
  defaultAllChecked: React.SetStateAction<boolean | undefined>;
  filterFn: React.SetStateAction<any | null>;
  customFilterValues: React.SetStateAction<any | null>;
  clearFilter: React.SetStateAction<boolean>;
  customUniqueValues: React.SetStateAction<any>;
}) {
  const [currentValue, setCurrentValue] = React.useState<React.SetStateAction<any>>([]);
  const [sortedUniqueValuesFirst, setSortedUniqueValuesFirst] = React.useState<
    React.SetStateAction<any>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] =
    React.useState<React.SetStateAction<any>>(false);

  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const [sortedUniqueValues, setSortedUniqueValues] = React.useState<any>([]);
  React.useEffect(() => {
    if (customUniqueValues) {
      if (customUniqueValues.length !== sortedUniqueValuesFirst.length) {
        setSortedUniqueValuesFirst([]);
      }
      const uniqueValues = Array.from(customUniqueValues)
        .sort()
        .map((row) => {
          return row === null || row === undefined ? "BLANK" : row;
        });
      setSortedUniqueValues(uniqueValues);
    } else if (customFilterValues) {
      const custArr: any = [];
      customFilterValues.map((item: any) => {
        custArr.push(item.name);
      });
      setSortedUniqueValues(custArr);
    } else {
      if (typeof firstValue === "number") {
        setSortedUniqueValues([]);
      } else {
        setSortedUniqueValues(Array.from(column.getFacetedUniqueValues().keys()).sort());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), customUniqueValues]);

  const priceRanges = React.useMemo(
    () => [
      { label: "$0.00 - $24.99", value: "$0.00 - $24.99" },
      { label: "$25.00 - $99.99", value: "$25.00 - $99.99" },
      { label: "$100.00 - $999.99", value: "$100.00 - $999.99" },
      { label: "$1,000.00+", value: "$1,000.00+" },
    ],
    []
  );
  React.useEffect(() => {
    if (typeof firstValue !== "number") {
      if (
        defaultAllChecked &&
        sortedUniqueValues &&
        sortedUniqueValuesFirst.length === 0
      ) {
        const uniqueValues = sortedUniqueValues.map((row: any) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleSelectAll = React.useCallback(() => {
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
  }, [
    currentValue,
    customFilterValues,
    firstValue,
    priceRanges,
    sortedUniqueValuesFirst,
  ]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  React.useEffect(() => {
    if (clearFilter) {
      handleSelectAll();
    }
  }, [clearFilter, handleSelectAll]);

  return (
    <div className={CustomReactTableStyles.OutsideClickHandlerDiv}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(false);
        }}
      >
        {" "}
        <Tooltip
          anchorSelect={`#${column.id}list`}
          place="bottom-start"
          noArrow={true}
          isOpen={isOpen}
          hidden={!isOpen}
          openOnClick={true}
          clickable={true}
          className={CustomReactTableStyles.toolTipClass}
        >
          <div
            className={CustomReactTableStyles.filterPopUp}
            id={column.id + "listelemnt"}
          >
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
                      {sortedUniqueValues
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
          <RiFilter2Fill className={CustomReactTableStyles.iconColor} size="20px" />
        </div>
      </OutsideClickHandler>
    </div>
  );
}
