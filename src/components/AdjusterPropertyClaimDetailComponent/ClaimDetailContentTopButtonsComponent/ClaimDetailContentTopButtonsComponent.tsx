import GenericButton from "@/components/common/GenericButton";
import topButtonStyle from "./top-button.module.scss";
import ClaimDetailsCardsComponent from "../ClaimDetailsCardsComponent";
import ServiceRequestsComponent from "../ServiceRequestsComponent";
import ContentListComponent from "../ContentListComponent";
import { claimDetailsTranslateType } from "@/translations/claimDetailsTranslate/en";
import useTranslation from "@/hooks/useTranslation";

type propTypes = {
  serviceRequestListRes: any;
  claimContentListRes: any;
  claimId: string;
};

const ClaimDetailContentTopButtonsComponent: React.FC<propTypes> = (props: propTypes) => {
  const { translate }: { translate: claimDetailsTranslateType | undefined } =
    useTranslation("claimDetailsTranslate");

  const buttonsArray = [
    {
      label: translate?.topOptionButtons?.calculateSettlement,
      clickHandler: "",
    },
    {
      label: translate?.topOptionButtons?.calculateDepreciation,
      clickHandler: "",
    },
    {
      label: translate?.topOptionButtons?.reAssignClaim,
      clickHandler: "",
    },
    {
      label: translate?.topOptionButtons?.supervisorReview,
      clickHandler: "",
    },
    {
      label: translate?.topOptionButtons?.closeClaim,
      clickHandler: "",
    },
    {
      label: translate?.topOptionButtons?.deleteClaim,
      clickHandler: "",
    },
  ];
  const buttons = buttonsArray.map((buttonObj, i) => {
    return (
      <div key={i}>
        <GenericButton label={buttonObj.label} size="small" />
      </div>
    );
  });

  return (
    <div>
      <div className={topButtonStyle.buttonRowContainer}>{buttons}</div>
      <div className="row">
        <ClaimDetailsCardsComponent claimId={props.claimId} />
      </div>
      {process.env.NEXT_PUBLIC_SERVICE_REQUESTS === "true" && (
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12">
            <ServiceRequestsComponent
              serviceRequestListRes={props.serviceRequestListRes}
            />
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-12">
          <ContentListComponent
            claimContentListRes={props.claimContentListRes}
            claimId={props.claimId}
          />
        </div>
      </div>
    </div>
  );
};
export default ClaimDetailContentTopButtonsComponent;
