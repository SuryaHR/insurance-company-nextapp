import { NO_IMAGE } from "@/constants/constants";
import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import React, { useContext } from "react";
import styles from "./profileCardList.module.scss";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";
import { updateSelectedProfile } from "@/reducers/_adjuster_reducers/GlobalSearch/GlobalSearchSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";

const ProfileCard = <T extends unknownObjectType>({ data }: { data: T }) => {
  const imgUrl = data?.displayPicture ?? NO_IMAGE;
  const dispatch = useAppDispatch();
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );
  const RowData = ({
    label,
    text,
    isLink,
  }: {
    label: string;
    text: string;
    isLink?: boolean;
  }) => (
    <div className="col-md-12 col-sm-12 col-xs-12 row">
      <label className={`col-md-3 col-sm-4 col-xs-12 ${styles.label}`}>{label}</label>
      <span className="col-md-9 col-sm-8 col-xs-12">
        {isLink && (
          <Link
            id={`link_${data?.id}`}
            onClick={() => {
              sessionStorage.setItem("PeopleDetails", JSON.stringify(data));
              dispatch(updateSelectedProfile(data));
            }}
            href={`/people-details?userId=${data?.id}`}
          >
            {text}
          </Link>
        )}
        {!isLink && text}
      </span>
      <Tooltip
        anchorSelect={`#link_${data?.id}`}
        content={translate?.adjusterGlobalSearchTranslate?.people?.profileBtn}
      />
    </div>
  );

  return (
    <div className={`col-md-12 col-sm-12 col-xs-12 row ${styles.root}`}>
      <div className="col-md-2 col-xs-12 col-sm-4 ps-2">
        <div className={styles.imageWrapper}>
          <div className={styles.imageDiv}>
            <Image
              unoptimized={true}
              src={imgUrl}
              alt="profile"
              fill={true}
              sizes="100%"
              style={{ objectFit: "contain" }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = NO_IMAGE;
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-md-9 col-sm-8 col-xs-12 row">
        <RowData
          label={translate?.adjusterGlobalSearchTranslate?.people?.header?.name}
          text={`${data?.firstName} ${data?.lastName}`}
          isLink={true}
        />
        <RowData
          label={translate?.adjusterGlobalSearchTranslate?.people?.header?.role}
          text={data?.roleText ?? "-"}
        />
        <RowData
          label={translate?.adjusterGlobalSearchTranslate?.people?.header?.company}
          text={data?.company?.name ?? "-"}
        />
        <RowData
          label={translate?.adjusterGlobalSearchTranslate?.people?.header?.status}
          text={
            data?.isActive
              ? translate?.adjusterGlobalSearchTranslate?.people?.header?.active
              : translate?.adjusterGlobalSearchTranslate?.people?.header?.inactive
          }
        />
        <RowData
          label={translate?.adjusterGlobalSearchTranslate?.people?.header?.login}
          text={data?.lastLogin ?? "-"}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
