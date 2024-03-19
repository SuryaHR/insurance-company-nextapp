import React from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import EvolutionInsuranceCompanyComponentStyle from "./EvolutionInsuranceCompanyComponent.module.scss";
import GenericButton from "@/components/common/GenericButton";
import GenericSelect from "@/components/common/GenericSelect/index";
import Image from "next/image";
import CompanyLogoImg from "@/assets/images/dummyimage.png";
import { FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import NoRecordComponent from "@/components/common/NoRecordComponent";
import Cards from "@/components/common/Cards";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";

const EvolutionInsuranceCompanyComponent = () => {
  return (
    <>
      <div className="col-12 mx-2">
        <GenericComponentHeading
          title={"Evolution Insurance Company"}
          customHeadingClassname={
            EvolutionInsuranceCompanyComponentStyle.PolicyholderText
          }
          customTitleClassname={
            EvolutionInsuranceCompanyComponentStyle.customTitleClassname
          }
        />
      </div>
      <div className={`col-12 m-1 ${EvolutionInsuranceCompanyComponentStyle.btnSection}`}>
        <GenericButton label="Cancel" theme="normal" type="submit" size="small" />

        <GenericButton label="Update" theme="normal" type="submit" size="small" />
      </div>
      <div
        className={`col-12 mx-2 ${EvolutionInsuranceCompanyComponentStyle.insComContainer}`}
      >
        <div className="col-5">
          <div
            className={`col-12 col-md-12 col-sm-12 my-1  ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Company Id
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Company Id " />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Company Name
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Company Name" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Claim Profile
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericSelect placeholder="Claim Profile" options={[]} />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Company s Alias Name
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Company's Alias Name" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Company Website
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Company Website" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Streamline URL
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Streamline URL" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Street Address One
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Street Address One" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Street Address Two
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Street Address Two" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                City
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="City" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                State
              </label>
            </div>
            <div
              className={`col-6 mx-5 ${EvolutionInsuranceCompanyComponentStyle.formDiv} `}
            >
              <div className="col-4">
                <GenericUseFormInput placeholder="City" />
              </div>
              <div className="col-1"></div>
              <div className="col-3">
                <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                  Zip Code
                </label>
              </div>
              <div className="col-4">
                <GenericUseFormInput placeholder="zip code" />
              </div>
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Phone Number
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Phone Number" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Fax
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Fax" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                Default Time Zone
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="Default Time Zone" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                SSO Base URL
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="SSO Base URL" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                SSO Client Id
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="SSO Client Id" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                SSO Client Secret Key
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="SSO Client Secret Key" />
            </div>
          </div>

          <div
            className={`col-12 col-md-12 col-sm-12 my-1 ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
          >
            <div className="col-4 text-right">
              <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                SSO Redirection URL
              </label>
            </div>
            <div className="col-6 mx-5">
              <GenericUseFormInput placeholder="SSO Redirection URL" />
            </div>
          </div>
        </div>
        <div className="col-7">
          <div
            className={`${EvolutionInsuranceCompanyComponentStyle.imageUploadDiv} col-11 mt-5`}
          >
            <Cards className="mx-2">
              <div
                className={`${EvolutionInsuranceCompanyComponentStyle.colorContainer} col-12 p-1`}
              >
                <div className="col-12">
                  <div>
                    <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                      Company Logo
                    </label>
                  </div>
                  <hr className={EvolutionInsuranceCompanyComponentStyle.hrColor}></hr>
                  <div
                    className={
                      EvolutionInsuranceCompanyComponentStyle.companyLogoImageContainer
                    }
                  >
                    <Image
                      className={
                        EvolutionInsuranceCompanyComponentStyle.companyLogoLogoImage
                      }
                      alt="company_logo"
                      fill
                      src={CompanyLogoImg}
                      style={{ objectFit: "contain" }}
                      sizes="100%"
                    />
                  </div>
                  <div className={EvolutionInsuranceCompanyComponentStyle.imageTitle}>
                    <span>Image title</span>
                  </div>
                  <div
                    className={`mx-2 ${EvolutionInsuranceCompanyComponentStyle.uploadFileBtn} `}
                  >
                    <label
                      htmlFor="file"
                      className={`${EvolutionInsuranceCompanyComponentStyle.fileUpload} row col-8`}
                    >
                      <div className="mr-4">
                        <FaUpload /> select File
                      </div>
                    </label>
                    <input
                      type="file"
                      id="file"
                      multiple
                      style={{ display: "none" }}
                      accept=".png,.jpg,.jpeg,.pdf"
                    ></input>
                  </div>
                  <div
                    className={`col-12 ${EvolutionInsuranceCompanyComponentStyle.btnDiv}`}
                  >
                    <GenericButton
                      btnClassname={EvolutionInsuranceCompanyComponentStyle.cancelBtn}
                      label="Cancel"
                      theme="normal"
                      type="submit"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </Cards>

            <Cards>
              <div
                className={`${EvolutionInsuranceCompanyComponentStyle.colorContainer} col-12 p-1`}
              >
                <div className="col-12">
                  <div>
                    <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
                      Company Logo
                    </label>
                  </div>
                  <hr className={EvolutionInsuranceCompanyComponentStyle.hrColor} />
                  <div
                    className={`col-12 ${EvolutionInsuranceCompanyComponentStyle.backGroundImageContainer}`}
                  >
                    <div className="col-4">
                      <div
                        className={`${EvolutionInsuranceCompanyComponentStyle.crossIcon} col-2`}
                      >
                        <MdCancel color="red" />
                      </div>
                      <div
                        className={
                          EvolutionInsuranceCompanyComponentStyle.companyLogoImageContainer
                        }
                      >
                        <Image
                          className={
                            EvolutionInsuranceCompanyComponentStyle.companyLogoLogoImage
                          }
                          alt="company_logo"
                          fill
                          src={CompanyLogoImg}
                          style={{ objectFit: "contain" }}
                          sizes="100%"
                        />
                      </div>
                      <div className="col-11 mx-2">
                        <GenericUseFormInput placeholder="tagline" />
                      </div>
                      <div
                        className={EvolutionInsuranceCompanyComponentStyle.bgImageTitle}
                      >
                        <span>Image title</span>
                      </div>
                      <div
                        className={`mx-2 ${EvolutionInsuranceCompanyComponentStyle.uploadFileBtn} `}
                      >
                        <label
                          htmlFor="file"
                          className={`${EvolutionInsuranceCompanyComponentStyle.fileUpload} row col-8`}
                        >
                          <div className="mr-4">
                            <FaUpload /> select File
                          </div>
                        </label>
                        <input
                          type="file"
                          id="file"
                          multiple
                          style={{ display: "none" }}
                          accept=".png,.jpg,.jpeg,.pdf"
                        ></input>
                      </div>
                      <div
                        className={`col-12 ${EvolutionInsuranceCompanyComponentStyle.btnDiv}`}
                      >
                        <GenericButton
                          btnClassname={EvolutionInsuranceCompanyComponentStyle.cancelBtn}
                          label="Cancel"
                          theme="normal"
                          type="submit"
                          size="small"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div
                        className={`${EvolutionInsuranceCompanyComponentStyle.crossIcon} col-2`}
                      >
                        <MdCancel color="red" />
                      </div>
                      <div
                        className={
                          EvolutionInsuranceCompanyComponentStyle.companyLogoImageContainer
                        }
                      >
                        <Image
                          className={
                            EvolutionInsuranceCompanyComponentStyle.companyLogoLogoImage
                          }
                          alt="company_logo"
                          fill
                          src={CompanyLogoImg}
                          style={{ objectFit: "contain" }}
                          sizes="100%"
                        />
                      </div>
                      <div className="col-11 mx-2">
                        <GenericUseFormInput placeholder="tagline" />
                      </div>
                      <div
                        className={EvolutionInsuranceCompanyComponentStyle.bgImageTitle}
                      >
                        <span>Image title</span>
                      </div>
                      <div
                        className={`mx-2 ${EvolutionInsuranceCompanyComponentStyle.uploadFileBtn} `}
                      >
                        <label
                          htmlFor="file"
                          className={`${EvolutionInsuranceCompanyComponentStyle.fileUpload} row col-8`}
                        >
                          <div className="mr-4">
                            <FaUpload /> select File
                          </div>
                        </label>
                        <input
                          type="file"
                          id="file"
                          multiple
                          style={{ display: "none" }}
                          accept=".png,.jpg,.jpeg,.pdf"
                        ></input>
                      </div>
                      <div
                        className={`col-12 ${EvolutionInsuranceCompanyComponentStyle.btnDiv}`}
                      >
                        <GenericButton
                          btnClassname={EvolutionInsuranceCompanyComponentStyle.cancelBtn}
                          label="Cancel"
                          theme="normal"
                          type="submit"
                          size="small"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div
                        className={`${EvolutionInsuranceCompanyComponentStyle.crossIcon} col-2`}
                      >
                        <MdCancel color="red" />
                      </div>
                      <div
                        className={
                          EvolutionInsuranceCompanyComponentStyle.companyLogoImageContainer
                        }
                      >
                        <Image
                          className={
                            EvolutionInsuranceCompanyComponentStyle.companyLogoLogoImage
                          }
                          alt="company_logo"
                          fill
                          src={CompanyLogoImg}
                          style={{ objectFit: "contain" }}
                          sizes="100%"
                        />
                      </div>
                      <div className="col-11 mx-2">
                        <GenericUseFormInput placeholder="tagline" />
                      </div>
                      <div
                        className={EvolutionInsuranceCompanyComponentStyle.bgImageTitle}
                      >
                        <span>Image title</span>
                      </div>
                      <div
                        className={`mx-2 ${EvolutionInsuranceCompanyComponentStyle.uploadFileBtn} `}
                      >
                        <label
                          htmlFor="file"
                          className={`${EvolutionInsuranceCompanyComponentStyle.fileUpload} row col-8`}
                        >
                          <div className="mr-4">
                            <FaUpload /> select File
                          </div>
                        </label>
                        <input
                          type="file"
                          id="file"
                          multiple
                          style={{ display: "none" }}
                          accept=".png,.jpg,.jpeg,.pdf"
                        ></input>
                      </div>
                      <div
                        className={`col-12 ${EvolutionInsuranceCompanyComponentStyle.btnDiv}`}
                      >
                        <GenericButton
                          btnClassname={EvolutionInsuranceCompanyComponentStyle.cancelBtn}
                          label="Cancel"
                          theme="normal"
                          type="submit"
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Cards>
          </div>
        </div>
      </div>

      <div className="col-12 mx-2">
        <GenericComponentHeading
          title={"Insurance Company Administrator"}
          customHeadingClassname={
            EvolutionInsuranceCompanyComponentStyle.PolicyholderText
          }
          customTitleClassname={
            EvolutionInsuranceCompanyComponentStyle.customTitleClassname
          }
        />
      </div>
      <div className="col-5 mx-2">
        <div
          className={`col-12 col-md-12 col-sm-12 my-1  ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
        >
          <div className="col-4 text-right">
            <span style={{ color: "red" }}>*</span>
            <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
              First Name
            </label>
          </div>
          <div className="col-6 mx-5">
            <GenericUseFormInput placeholder="Insurances" />
          </div>
        </div>
        <div
          className={`col-12 col-md-12 col-sm-12 my-1  ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
        >
          <div className="col-4 text-right">
            <span style={{ color: "red" }}>*</span>
            <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
              Last Name
            </label>
          </div>
          <div className="col-6 mx-5">
            <GenericUseFormInput placeholder="Admins" />
          </div>
        </div>
        <div
          className={`col-12 col-md-12 col-sm-12 my-1  ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
        >
          <div className="col-4 text-right">
            <span style={{ color: "red" }}>*</span>
            <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
              Email Id
            </label>
          </div>
          <div className="col-6 mx-5">
            <GenericUseFormInput placeholder="Email Id" />
          </div>
        </div>

        <div
          className={`col-12 col-md-12 col-sm-12 my-1  ${EvolutionInsuranceCompanyComponentStyle.formDiv}`}
        >
          <div className="col-4 text-right">
            <label className={EvolutionInsuranceCompanyComponentStyle.labelStyle}>
              Phone Number
            </label>
          </div>
          <div className="col-6 mx-5">
            <GenericUseFormInput placeholder="(333) -333-3333" />
          </div>
        </div>
        <div className="col-12 mx-4">
          <NoRecordComponent
            message="*An email will be sent to admin to complete profile."
            textLeftClass={true}
          />
        </div>
      </div>
      <div className="col-12 mx-2">
        <hr />
      </div>
      <div
        className={`col-12 my-2 ${EvolutionInsuranceCompanyComponentStyle.btnSection}`}
      >
        <GenericButton label="Cancel" theme="normal" type="submit" size="small" />

        <GenericButton label="Update" theme="normal" type="submit" size="small" />
      </div>
    </>
  );
};

export default EvolutionInsuranceCompanyComponent;
