"use client";
import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  Row,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import VendorListStyle from "./vendorAssignListTable.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "@/app/[lang]/loading";
import {
  fetchVendorInventoryAction,
  updateVendorAssignmentPayload,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import { selectVendor } from "@/services/_adjuster_services/ClaimService";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import LimitedWidthContent from "@/components/common/LimitedWidthContent";

interface VendorItemsTableProps {
  vendorInventoryListAPI: Array<object>;
  fetchVendorInventoryAction: any;
  CRN: any;
  vendorSearchKeyword: any;
}

const VendorAssignListTable: React.FC<connectorType> = (props: VendorItemsTableProps) => {
  const { fetchVendorInventoryAction, vendorInventoryListAPI, CRN, vendorSearchKeyword } =
    props;
  // const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ContentService[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [selectedSubservices, setSelectedSubservices] = useState<any[]>([]);
  const [vendorInventoryListAPIData, setVendorInventoryListAPIData] =
    useState<any>(vendorInventoryListAPI);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [selectedSubservicesServices, setSelectedSubservicesServices] = useState<
    { name: string }[]
  >([]);

  const ClaimProfile = process.env.NEXT_PUBLIC_CLAIM_PROFILE;
  const dispatch = useAppDispatch();
  const prevProps = React.useRef();
  useEffect(() => {
    fetchVendorInventoryAction({
      pageNo: 1,
      recordPerPage: 10,
      query: vendorSearchKeyword?.searchKeyword ? vendorSearchKeyword?.searchKeyword : "",
    });
  }, [fetchVendorInventoryAction, vendorSearchKeyword]);

  type Address = {
    city: string;
    completeAddress: string;
  };

  type SpecializedCategory = {
    id: number;
    speciality: string;
    noOfItems: number;
  };

  type ContentService = {
    service: string;
    id: number;
    subServices?: any[];
  };

  type VendorData = {
    contentServices: ContentService[];
    id: any;
    select: boolean;
    name: string;
    assignmentsInHand: number;
    itemsInHand: number;
    specializedCategories: SpecializedCategory[] | null;
    shippingAddress: Address;
    registrationNumber: string;
    // description: string;
  };

  const columnHelper = createColumnHelper<VendorData>();
  const checkboxAccessor = (data: VendorData) => data.select;

  const handleServiceChange = (selectedOption: any) => {
    const service = selectedServices.find(
      (selectService) => selectService.id === selectedOption?.value
    );

    if (service) {
      const subservices = service.subServices || [];
      const selectedServiceLabel = selectedOption?.label;

      if (selectedServiceLabel === "Quote With Contact" && ClaimProfile === "Contents") {
        const salvageSubservices = subservices.filter(
          (subservice) => subservice.service === "Salvage"
        );
        setSelectedSubservices(salvageSubservices);
      } else {
        setSelectedSubservices([]);
      }

      setSelectedSubservicesServices([]);
      dispatch(
        updateVendorAssignmentPayload({
          requestedVendorService: {
            id: service.id,
            name: service.service,
            subContentServices:
              selectedSubservices.length > 0
                ? selectedSubservices.map((subservice) => ({ name: subservice.service }))
                : null,
          },
        })
      );
    } else {
      setSelectedSubservices([]);
      setSelectedSubservicesServices([]);
      dispatch(
        updateVendorAssignmentPayload({
          requestedVendorService: {},
        })
      );
    }
  };

  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const handleRowSelection = async (row: Row<VendorData>) => {
    const registrationNumber = row.original.registrationNumber;
    dispatch(
      updateVendorAssignmentPayload({
        vendorDetails: {
          registrationNumber,
        },
        claimBasicDetails: {
          claimNumber,
        },
        insuranceCompanyDetails: {
          crn: CRN,
        },
        vendorAssigment: {
          claimNumber: claimNumber,
          dueDate: null,
          remark: null,
        },
        claimProfile: ClaimProfile,
      })
    );
    try {
      setTableLoader(true);
      const result = await selectVendor({ registrationNumber, categories: null });
      if (result?.data && result?.data.contentServices) {
        const services = result.data.contentServices;
        const newFilteredServices = services.filter((service: any) => {
          if (ClaimProfile === "Contents") {
            return service.service !== "Salvage Only";
          } else {
            return true;
          }
        });
        setSelectedServices(newFilteredServices);
        // setSelectedSubServices([]);
        setSelectedSubservices([]);
        setSelectedValue(null);
        setTableLoader(false);
      } else {
        console.log("no found in the API ");
      }
    } catch (error) {
      console.error("Error calling selectVendor API", error);
    }
  };

  useEffect(() => {
    if (selectedValue && selectedSubservicesServices.length > 0) {
      dispatch(
        updateVendorAssignmentPayload({
          requestedVendorService: {
            id: selectedValue.value,
            name: selectedValue.label,
            subContentServices: selectedSubservicesServices,
          },
        })
      );
    }
  }, [dispatch, selectedValue, selectedSubservicesServices]);

  const formatSpecializedCategories = (
    categories: SpecializedCategory[] | null
  ): string => {
    if (!categories) return "";

    return categories.map((category) => category.speciality).join(", ");
  };
  const handleCheckboxChange = (checkboxId: number) => {
    const subservice = selectedSubservices.find(
      (subservice) => subservice.id === checkboxId
    );

    if (subservice) {
      if (selectedCheckboxes.includes(checkboxId)) {
        setSelectedCheckboxes(selectedCheckboxes.filter((id) => id !== checkboxId));
        setSelectedSubservicesServices(
          selectedSubservicesServices.filter((s) => s.name !== subservice.service)
        );
      } else {
        setSelectedCheckboxes([...selectedCheckboxes, checkboxId]);
        setSelectedSubservicesServices([
          ...selectedSubservicesServices,
          { name: subservice.service },
        ]);
      }
    }
  };

  const columns = [
    columnHelper.accessor(checkboxAccessor, {
      header: () => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      ),
      meta: {
        headerClass: VendorListStyle.checkHeader,
      },
      id: "checkbox",
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <div
          className="d-flex justify-content-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="radio"
            name="assignRadio"
            className={VendorListStyle.checkbox}
            checked={row.original.select}
            // checked={selectedRow === row.original}
            onClick={(e) => {
              e.stopPropagation();
              handleRowSelection(row);
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      id: "name",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("assignmentsInHand", {
      header: () => "Assignments in Hand",
      id: "assignmentsInHand",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("itemsInHand", {
      header: () => "Items In Hand",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("specializedCategories", {
      header: () => "Specialized Categories",
      id: "specializedCategories",
      cell: (info) => (
        <div>
          <LimitedWidthContent
            text={formatSpecializedCategories(info.renderValue())}
            limit={70}
          />
        </div>
      ),
      size: 450,
      enableSorting: false,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("shippingAddress.city", {
      header: () => "City",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
  ];

  useEffect(() => {
    if (prevProps.current !== vendorInventoryListAPI) {
      setVendorInventoryListAPIData(vendorInventoryListAPI);
    }
  }, [vendorInventoryListAPI]);

  const table = useReactTable({
    columns,
    data: vendorInventoryListAPIData as VendorData[],
    enableColumnFilters: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {tableLoader && <Loading />}
      {vendorInventoryListAPIData && vendorInventoryListAPIData.length > 0 ? (
        <div className={VendorListStyle.addListTableContainer}>
          <CustomReactTable table={table} />
        </div>
      ) : (
        <p className="d-flex justify-content-center">Loading...</p>
      )}
      <div className="row mt-3">
        <label className={VendorListStyle.textAddStyle}>4) Services</label>
      </div>
      <div className="row mt-2">
        <div className="col-1" />
        <div className="col-md-2 col-sm-6 col-12">
          <label className={VendorListStyle.textAddStyle}>
            <span style={{ color: "red" }}>*</span> Service Needed
          </label>
        </div>
        <div className={`col-md-3 col-sm-6 col-12 ${VendorListStyle.selectContainer}`}>
          <GenericSelect
            placeholder="Select"
            // options={selectedServices}
            value={selectedValue}
            onChange={(selectedOption: any) => {
              setSelectedValue(selectedOption);
              handleServiceChange(selectedOption);
            }}
            options={selectedServices.map((service) => ({
              label: service.service,
              value: service.id,
            }))}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-3" />
        <div className={`col-md-8 col-sm-6 col-12 ${VendorListStyle.selectContainer}`}>
          <div className={VendorListStyle.checkboxContainer}>
            {selectedValue &&
              selectedSubservices.map((subservice) => (
                <div key={subservice.id} className={VendorListStyle.formCheck}>
                  <input
                    type="checkbox"
                    id={subservice.id}
                    checked={selectedCheckboxes.includes(subservice.id)}
                    onChange={() => handleCheckboxChange(subservice.id)}
                  />
                  <label className={VendorListStyle.formCheckLabel}>
                    {subservice.service}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-1"></div>
        {selectedValue && selectedSubservices && (
          <div className="col-md-4 col-sm-6 col-12">
            <label className={VendorListStyle.labelStyles}>
              Minimum Cost of Services:
              <span className={VendorListStyle.spanStyle}></span>
            </label>
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  vendorInventoryListAPI: state.addItemsTable.vendorInventoryListAPIData,
  vendorSearchKeyword: state.addItemsTable.vendorSearchKeyword,
  CRN: selectCRN(state),
});

const mapDispatchToProps = {
  fetchVendorInventoryAction,
  updateVendorAssignmentPayload,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(VendorAssignListTable);
