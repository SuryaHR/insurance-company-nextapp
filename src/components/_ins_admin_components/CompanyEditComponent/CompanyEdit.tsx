"use client";
import React, { useEffect, useState } from "react";
import styles from "./CompanyEdit.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import GenericButton from "@/components/common/GenericButton";
import CustomLoader from "@/components/common/CustomLoader";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import GenericSelect from "@/components/common/GenericSelect";
import EmployeList from "./EmployeList/EmployeList";
import GenericPhoneFormat, {
  phoneFormatHandlers,
} from "@/components/common/GenericInput/GenericPhoneFormat";
import { useRouter } from "next/navigation";
import { ConnectedProps, connect } from "react-redux";
import {
  addCompanyEmployees,
  addStates,
  addRoles,
} from "@/reducers/_ins_admin_reducers/BranchSlice";
import {
  getRole,
  getCompanyEmployees,
  getStates,
} from "@/services/_ins_admin_services/usersService";

interface propsTypes {
  officeId?: string;
}

interface companyState {
  officeCode: string;
  officeName: string;
  streetAddress1: string;
  streetAddress2: any;
  city: any;
  state: any;
  zipCode: any;
  fax: any;
  phoneNumber: any;
  invoiceForwardEmail: any;
  timeZone: any;
  branchManager: any;
}

const CompanyEdit: React.FC<propsTypes & connectorType> = ({
  officeId,
  companyId,
  companyEmployees,
  roles,
  states,
  addCompanyEmployees,
  addRoles,
  addStates,
}) => {
  console.log(officeId);
  const initialCompanyState: companyState = {
    officeCode: "",
    officeName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    fax: "",
    phoneNumber: "",
    invoiceForwardEmail: "",
    timeZone: "",
    branchManager: "",
  };
  const router = useRouter();
  const prevProps = React.useRef();

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const workPhoneRef = React.useRef<phoneFormatHandlers>(null);
  const [branchData, setBranchData] = useState<any>(initialCompanyState);
  const [stateOptions, setStateOptions] = useState<any>();

  const init = React.useCallback(async () => {
    setIsLoader(true);

    try {
      const [rolesRes, statesRes, employeesRes] = await Promise.all([
        getRole(),
        getStates({ isTaxRate: false, isTimeZone: true }),
        getCompanyEmployees({ companyId: parseInt(companyId) }),
      ]);

      if (rolesRes?.status == 200) {
        addRoles(rolesRes?.data);
      }

      if (statesRes?.status == 200) {
        addStates(statesRes?.data);
      }

      if (employeesRes?.status == 200) {
        addCompanyEmployees(employeesRes?.data);
      }
    } catch (error) {
      console.error("Error occurred during initialization:", error);
    } finally {
      setIsLoader(false);
    }
  }, [companyId]);

  useEffect(() => {
    init();
  }, [init]);

  const saveHandle = () => {
    console.log("saveHandle", branchData);
  };

  const handleOnchange = (e: any) => {
    setBranchData({ ...branchData, [e?.target?.id]: e?.target?.value });
  };

  useEffect(() => {
    if (prevProps.current !== states) {
      console.log("useEffect===>", states);
      const updatedStateData = states.map((item: any) => ({
        // ...item,
        value: item?.id,
        label: item?.state,
      }));
      setStateOptions(updatedStateData);
    }
  }, [companyEmployees, roles, states]);

  return (
    <div className={styles.companyEditCont}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <GenericComponentHeading title="New Office" />
      <div className={`col-md-12 ${styles.paddingBottom20}`}>
        <div className={styles.buttonRowContainer}>
          <GenericButton
            className={styles.buttonCss}
            label={"Cancel"}
            onClick={() => router.push(`/company`)}
            size="small"
          />
          <GenericButton
            className={styles.buttonCss}
            label={"Save"}
            size="small"
            onClick={saveHandle}
          />
        </div>
      </div>
      <div className={`${styles.companyCont}`}>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            OfficeCode
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="OfficeCode"
                id="officeCode"
                value={branchData.officeCode}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Branch/Office Name
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Branch/Office Name"
                id="officeName"
                value={branchData.officeName}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Street Address One
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Street Address One"
                id="streetAddress1"
                value={branchData.streetAddress1}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Street Address Two
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Street Address Two"
                id="streetAddress2"
                value={branchData.streetAddress2}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>City</label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="City"
                id="city"
                value={branchData.city}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <div className="col-md-6 row">
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>State</label>
            <div className="col-md-3 col-sm-6">
              <span className={styles.labelTextRight}>
                <GenericSelect
                  options={stateOptions}
                  name="state"
                  id="state"
                  isModalPopUp={true}
                />
              </span>
            </div>
            <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
              Zip Code
            </label>
            <div className="col-md-3 col-sm-6">
              <span className={styles.labelTextRight}>
                <GenericNormalInput
                  placeholder="Zip Code"
                  id="zipCode"
                  value={branchData.zipCode}
                  onChange={handleOnchange}
                />
              </span>
            </div>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>Fax</label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Fax"
                id="fax"
                value={branchData.fax}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Phone Number
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericPhoneFormat
                ref={workPhoneRef}
                handleChange={(e: any) => {
                  setBranchData({ ...branchData, phoneNumber: e?.originalValue });
                }}
                formControlClassname="col-md-8"
                placeholder="XXX-XXX-XXXX"
                id="phoneNumber"
                value={branchData.phoneNumber}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Invoice Forwarding Email
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Invoice Forwarding Email"
                id="invoiceForwardEmail"
                value={branchData.invoiceForwardEmail}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Default Time Zone
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Default Time Zone"
                id="timeZone"
                value={branchData.timeZone}
                onChange={handleOnchange}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Branch Manager
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericSelect
                options={[]}
                name="branchManager"
                formControlClassname="col-md-8"
                isModalPopUp={true}
                id="branchManager"
                value={branchData.branchManager}
                onChange={handleOnchange}
                isFullWidth={false}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={`col-md-12 ${styles.paddingBottom20}`}>
        <hr className={styles.hrStyle} />
        <div className={styles.buttonRowContainer}>
          <GenericButton
            className={styles.buttonCss}
            label={"Cancel"}
            onClick={() => router.push(`/company`)}
            size="small"
          />
          <GenericButton
            className={styles.buttonCss}
            label={"Save"}
            size="small"
            onClick={saveHandle}
          />
        </div>
      </div>
      <GenericComponentHeading title="Branch Employees" />
      <div className={styles.companyEmpCont}>
        <EmployeList data={{}} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  companyId: state?.session?.companyId,
  companyEmployees: state?.BranchSlice?.companyEmployees,
  states: state?.BranchSlice?.states,
  roles: state?.BranchSlice?.roles,
});
const mapDispatchToProps = {
  addCompanyEmployees,
  addStates,
  addRoles,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(CompanyEdit);
