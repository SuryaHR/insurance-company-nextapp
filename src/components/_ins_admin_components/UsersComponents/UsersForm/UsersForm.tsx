import GenericButton from "@/components/common/GenericButton";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import React, { useRef, useState } from "react";
import styles from "./usersForm.module.scss";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, any, email, minLength, object, string } from "valibot";
import GenericSelect from "@/components/common/GenericSelect";
import {
  addUser,
  getBranchOffice,
  getDesignation,
  getReportingManagerRolemap,
  getRole,
  // updateUser,
} from "@/services/_ins_admin_services/usersService";
import useInitHook from "@/hooks/useInitHook";
import { getFileExtension, getLocalFileUrl } from "@/utils/utitlity";
import Image from "next/image";
import { NO_IMAGE } from "@/constants/constants";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import { Controller } from "react-hook-form";
import { unknownObjectType } from "@/constants/customTypes";
import { managerRoleMaping } from "@/constants/managerRoleMaping";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericPhoneFormat, {
  phoneFormatHandlers,
} from "@/components/common/GenericInput/GenericPhoneFormat";

interface fileWithUrl extends File {
  url?: string;
}

interface propType {
  handleClose: () => void;
  employeeDetails?: unknownObjectType;
}

function UsersForm(props: propType) {
  const workPhoneRef = useRef<phoneFormatHandlers>(null);
  const cellPhoneRef = useRef<phoneFormatHandlers>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<fileWithUrl[] | null>(null);
  const { handleClose, employeeDetails = null } = props;
  const ssoOption = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const [office, setOffice] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [reportingManager, setReportingManager] = useState([]);
  const companyId = useAppSelector(selectCompanyId);
  const schema = object({
    firstName: string("First Name", [minLength(1, "Please enter first name.")]),
    lastName: string("Last Name", [minLength(1, "Please enter last name.")]),
    email: string("Email", [
      minLength(1, "Please enter email."),
      email("Enter valid email."),
    ]),
    dayTimePhone: string("Work Phone No.", [
      minLength(10, "Please enter valid phone number."),
    ]),
    cellPhone: any(),
    extension: string("Extension.", [minLength(0)]),
    branch: any(),
    designation: object({
      id: any(),
      name: any(),
    }),
    role: object({
      id: any(),
      name: any(),
    }),
    reporting: object({
      id: any(),
      name: any(),
    }),
    SSOEnabled: object({
      label: any(),
      value: any(),
    }),
  });

  const { register, handleSubmit, control, formState, setValue, setError, clearErrors } =
    useCustomForm(schema);
  const { errors, isValid } = formState;
  const getOtherDetails = async () => {
    Promise.all([getBranchOffice(+companyId), getDesignation(), getRole()])
      .then((values) => {
        const [officeListResp, designationListResp, roleListResp] = values;
        if (officeListResp.status === 200) {
          setOffice(officeListResp?.data);
        }
        if (designationListResp.status === 200) {
          setDesignationList(designationListResp?.data);
        }
        if (roleListResp.status === 200) {
          setRoleList(roleListResp?.data);
        }
      })
      .catch((err) => console.log("error", err));
  };

  useInitHook({
    methods: () => {
      setValue("SSOEnabled", { label: "No", value: "No" });
      getOtherDetails();
    },
  });

  const fetchReportingManager = async (value: unknownObjectType) => {
    if (value) {
      const param = {
        manegers: managerRoleMaping[value?.id],
      };
      const res = await getReportingManagerRolemap(param);
      if (res.status === 200 && !res.errorCode) {
        setReportingManager(res.data);
      } else {
        setReportingManager([]);
      }
    } else {
      setReportingManager([]);
    }
  };

  const handleFormSubmit = async (values: Output<typeof schema>) => {
    try {
      const {
        designation,
        reporting,
        email,
        dayTimePhone,
        cellPhone,
        firstName,
        lastName,
        SSOEnabled,
        role,
        extension,
      } = values;
      const formData = new FormData();
      const empDetails = {
        id: employeeDetails?.branchDetails?.id ?? null,
        employeeDetails: [
          {
            password: null,
            id: employeeDetails?.userId ?? null,
            designation: {
              id: designation?.id ?? null,
            },
            reportingManager: {
              id: reporting?.id ?? null,
            },
            email: email,
            dayTimePhone,
            cellPhone: cellPhone ?? null,
            firstName,
            lastName,
            agencyCode: employeeDetails?.agencyCode ?? null,
            isActive: true,
            roles: [
              {
                id: role?.id ?? null,
              },
            ],
            isEmailChanges: true,
            extension: extension ?? null,
            ssoEnableFlag:
              SSOEnabled.value.toString().toLowerCase() === "yes" ? true : false,
          },
        ],
      };
      if (selectedFile) {
        const fileDetails = [
          {
            fileName: selectedFile[0].name,
            fileType: selectedFile[0].type,
            extension: getFileExtension(selectedFile[0]),
            filePurpose: "PROFILE_PICTURE",
            latitude: null,
            longitude: null,
          },
        ];
        formData.append("file", selectedFile[0]);
        formData.append("filesDetails", JSON.stringify(fileDetails));
      }
      formData.append("details", JSON.stringify(empDetails));
      const res = await addUser(formData);
      handleClose();
      console.log("response::", res);
    } catch (error) {
      console.log("@create_user_error", error);
    }
  };

  const handleFileInputClick = () => {
    fileRef?.current?.click();
  };

  const handleSelect = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFile: fileWithUrl[] = [];
      const file: fileWithUrl[] = Array.from(e.target.files || []);
      for (let i = 0; i < file.length; i++) {
        file[i].url = getLocalFileUrl(file[i]);
        newFile.push(file[i]);
      }
      setSelectedFile(newFile);
    } else {
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const customLabel = (labelText: string, isMandate?: boolean) => (
    <label className="col-md-4">
      {isMandate && <span className="text-danger">* </span>}
      {labelText}
    </label>
  );

  return (
    <div className={styles.root}>
      <GenericComponentHeading title="New User" />
      <form className={styles.formContainer} onSubmit={handleSubmit(handleFormSubmit)}>
        <div className={styles.btnGroup}>
          <GenericButton label="Cancel" size="medium" onClickHandler={handleClose} />
          <GenericButton
            label="Create User"
            type="submit"
            size="medium"
            disabled={!isValid || Object.keys(errors).length !== 0}
          />
        </div>
        <div className={styles.formContent}>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("First Name", true)}
              <GenericUseFormInput
                placeholder="First Name"
                formControlClassname="col-md-8"
                showError={errors["firstName"]}
                errorMsg={errors["firstName"]?.message}
                {...register("firstName")}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Last Name", true)}
              <GenericUseFormInput
                placeholder="Last Name"
                formControlClassname="col-md-8"
                showError={errors["lastName"]}
                errorMsg={errors["lastName"]?.message}
                {...register("lastName")}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Email", true)}
              <GenericUseFormInput
                formControlClassname="col-md-8"
                showError={errors["email"]}
                errorMsg={errors["email"]?.message}
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <div className="col-md-4 my-auto">
              <span className="col-md-12 text-danger">
                This will be the login id for the user
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Work Phone No", true)}
              {/* <GenericInput
                formControlClassname="col-md-8"
                {...register("dayTimePhone")}
                showError={errors["dayTimePhone"]}
                errorMsg={errors["dayTimePhone"]?.message}
                placeholder="XXX-XXX-XXXX"
              /> */}
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
                    showError={errors["dayTimePhone"]}
                    errorMsg={errors["dayTimePhone"]?.message}
                    placeholder="XXX-XXX-XXXX"
                  />
                )}
              />
            </div>
            <div className="col-md-4 d-flex">
              <label className="my-auto me-2">Extension</label>
              <GenericUseFormInput
                formControlClassname="col-md-8"
                {...register("extension")}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Mobile Phone No")}
              {/* <GenericInput
                formControlClassname="col-md-8"
                {...register("cellPhone")}
                placeholder="XXX-XXX-XXXX"
              /> */}
              <Controller
                name="cellPhone"
                control={control}
                render={({ field: { onChange: cellPhoneChange } }) => (
                  <GenericPhoneFormat
                    ref={cellPhoneRef}
                    handleChange={({ originalValue }) => {
                      cellPhoneChange(originalValue);
                      if (originalValue && originalValue?.length < 10) {
                        setError("cellPhone", {
                          message: "Please enter valid phone",
                          type: "onChange",
                        });
                      } else {
                        clearErrors("cellPhone");
                      }
                    }}
                    formControlClassname="col-md-8"
                    showError={errors["cellPhone"]}
                    errorMsg={errors["cellPhone"]?.message}
                    placeholder="XXX-XXX-XXXX"
                    defaultValue=""
                  />
                )}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Branch/Office")}
              <Controller
                control={control}
                name="branch"
                render={({ field }) => (
                  <GenericSelect
                    options={office}
                    getOptionLabel={(option: { branchName: string }) => option.branchName}
                    getOptionValue={(option: { id: number }) => option.id}
                    formControlClassname="col-md-8"
                    isFullWidth={false}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Designation", true)}
              <Controller
                control={control}
                name="designation"
                render={({ field }) => (
                  <GenericSelect
                    options={designationList}
                    getOptionLabel={(option: { name: string }) => option.name}
                    getOptionValue={(option: { id: number }) => option.id}
                    formControlClassname="col-md-8"
                    showError={errors["designation"]}
                    errorMsg={"Please select designation."}
                    isFullWidth={false}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Role", true)}
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange: onRoleSelect, ...rest } }) => (
                  <GenericSelect
                    options={roleList}
                    getOptionLabel={(option: { name: string }) => option.name}
                    getOptionValue={(option: { id: number }) => option.id}
                    formControlClassname="col-md-8"
                    onChange={(e: unknownObjectType) => {
                      // @ts-expect-error reset reporting to null instead of object
                      setValue("reporting", null);
                      fetchReportingManager(e);
                      onRoleSelect(e);
                    }}
                    showError={errors["role"]}
                    errorMsg={"Please select role."}
                    isFullWidth={false}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Reporting Manager", true)}
              <Controller
                control={control}
                name="reporting"
                render={({ field }) => (
                  <GenericSelect
                    options={reportingManager}
                    getOptionLabel={(option: {
                      firstName: string;
                      lastName: string;
                      role: unknownObjectType[];
                    }) =>
                      `${option.firstName} ${
                        option.lastName
                      } (${option.role[0].roleName.toUpperCase()})`
                    }
                    getOptionValue={(option: { id: number }) => option.id}
                    formControlClassname="col-md-8"
                    showError={errors["reporting"]}
                    errorMsg={"Please select reporting manager."}
                    isFullWidth={false}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 row">
              {customLabel("SSO Enabled", true)}
              <Controller
                control={control}
                name="SSOEnabled"
                render={({ field }) => (
                  <GenericSelect
                    options={ssoOption}
                    isClearable={false}
                    formControlClassname="col-md-8"
                    isFullWidth={false}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 row">
              {customLabel("Profile Picture")}
              <div className="col-md-8">
                <input type="file" hidden ref={fileRef} onChange={handleSelect} />
                {!selectedFile && (
                  <div className={styles.fileBtnWrapper}>
                    <GenericButton
                      label="Click to upload a profile picture"
                      theme="linkBtn"
                      btnClassname={styles.fileBtn}
                      onClickHandler={handleFileInputClick}
                    />
                  </div>
                )}
                {selectedFile && (
                  <div className={styles.fileBtnWrapper}>
                    <GenericButton
                      label="Upload new picture"
                      theme="linkBtn"
                      btnClassname={styles.fileBtn}
                      onClickHandler={handleFileInputClick}
                    />
                    <GenericButton
                      label="Delete"
                      theme="linkBtn"
                      btnClassname={styles.fileBtn}
                      onClickHandler={removeFile}
                    />
                  </div>
                )}
                {selectedFile && (
                  <div className={styles.imageWrapper}>
                    <Image
                      unoptimized={true}
                      src={selectedFile[0]?.url ?? NO_IMAGE}
                      alt="profile pic"
                      fill={true}
                      sizes="100%"
                      style={{ objectFit: "contain" }}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = NO_IMAGE;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr />
          <div className={styles.btnGroup}>
            <GenericButton label="Cancel" size="medium" onClickHandler={handleClose} />
            <GenericButton
              label="Create User"
              type="submit"
              size="medium"
              disabled={!isValid || Object.keys(errors).length !== 0}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default UsersForm;
