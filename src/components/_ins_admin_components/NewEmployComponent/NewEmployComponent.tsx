"use client";
import React, { useEffect, useState } from "react";
import styles from "./NewEmployComponent.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import GenericButton from "@/components/common/GenericButton";
import CustomLoader from "@/components/common/CustomLoader";
import GenericSelect from "@/components/common/GenericSelect";
import GenericPhoneFormat, {
  phoneFormatHandlers,
} from "@/components/common/GenericInput/GenericPhoneFormat";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import { Controller } from "react-hook-form";
import useCustomForm from "@/hooks/useCustomForm";
import { minLength, object, string } from "valibot";

const NewEmployComponent: React.FC = () => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const workPhoneRef = React.useRef<phoneFormatHandlers>(null);

  const schema = object({
    dayTimePhone: string("Work Phone No.", [
      minLength(10, "Please enter valid phone number."),
    ]),
  });

  const { control } = useCustomForm(schema);

  useEffect(() => {
    setIsLoader(false);
  }, []);

  const resetPass = () => {
    setResetPassword(true);
  };

  return (
    <div className={styles.companyEditCont}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <GenericComponentHeading title="New Office" />
      <div className={`col-md-12 ${styles.paddingBottom20}`}>
        <div className={styles.buttonRowContainer}>
          <GenericButton className={styles.buttonCss} label={"Cancel"} size="small" />
          <GenericButton className={styles.buttonCss} label={"Save"} size="small" />
        </div>
      </div>

      <GenericComponentHeading title="General Information" />
      <div className={`${styles.companyCont}`}>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            First Name
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="First Name"
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>Last Name</label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Last Name"
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>Email Id</label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput formControlClassname="col-md-8" placeholder="Email" />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Phone Number
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <Controller
                name="dayTimePhone"
                control={control}
                render={({ field: { onChange: dayPhoneChange } }) => (
                  <GenericPhoneFormat
                    ref={workPhoneRef}
                    handleChange={({ originalValue }) => {
                      dayPhoneChange(originalValue);
                    }}
                    formControlClassname="col-md-8"
                    placeholder="XXX-XXX-XXXX"
                  />
                )}
              />
            </span>
          </div>
        </div>
      </div>

      <GenericComponentHeading title="Office Information" />
      <div className={`${styles.companyCont}`}>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Designation
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericSelect
                options={[]}
                name="designation"
                formControlClassname={`col-md-6 ${styles.selectCont}`}
                isModalPopUp={true}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>Role</label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericSelect
                options={[]}
                name="role"
                formControlClassname={`col-md-6 ${styles.selectCont}`}
                isModalPopUp={true}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Agent Code
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="Agent Code"
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Branch Office
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericSelect
                options={[]}
                name="branchOffice"
                formControlClassname={`col-md-6 ${styles.selectCont}`}
                isModalPopUp={true}
              />
            </span>
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Reporting Manager
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericSelect
                options={[]}
                name="reportingManager"
                formControlClassname={`col-md-6 ${styles.selectCont}`}
                isModalPopUp={true}
              />
            </span>
          </div>
        </div>
      </div>
      <GenericComponentHeading title="Account Information" />
      <div className={`${styles.companyCont}`}>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>User Name</label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericNormalInput
                formControlClassname="col-md-8"
                placeholder="User Name"
              />
            </span>
          </div>
        </div>
        {resetPassword && (
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
              Password
            </label>
            <div className="col-md-6 col-sm-6">
              <span className={styles.labelTextRight}>
                <GenericNormalInput
                  formControlClassname="col-md-8"
                  placeholder="Password"
                />
              </span>
            </div>
          </div>
        )}
        {!resetPassword && (
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
              Password
            </label>
            <label className={`col-md-1 col-sm-6 ${styles.labelTextLeft}`}>
              **********
            </label>
            <div className="col-md-6 col-sm-6">
              <span className={styles.labelTextRight}>
                <a onClick={resetPass}>Reset Password</a>
              </span>
            </div>
          </div>
        )}
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-2 col-sm-6 ${styles.labelTextLeft}`}>
            Account Stauts
          </label>
          <div className="col-md-6 col-sm-6">
            <span className={styles.labelTextRight}>
              <GenericSelect
                options={[]}
                name="accountStauts"
                formControlClassname={`col-md-8 ${styles.selectCont}`}
                isModalPopUp={true}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={`col-md-12 ${styles.paddingBottom20}`}>
        <hr className={styles.hrStyle} />
        <div className={styles.buttonRowContainer}>
          <GenericButton className={styles.buttonCss} label={"Cancel"} size="small" />
          <GenericButton className={styles.buttonCss} label={"Save"} size="small" />
        </div>
      </div>
    </div>
  );
};

export default NewEmployComponent;
