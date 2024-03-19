import ClaimSnapShotComponent from "./ClaimSnapShotComponent";
import MessagesComponent from "./MessagesComponent";
import PolicyHoldersComponent from "./PolicyHoldersComponent";
import ClaimDetailsCardStyle from "./ClaimDetailsCards.module.scss";

type claimDetailsCardType = {
  claimId: string;
};

const ClaimDetailsCardsComponent: React.FC<claimDetailsCardType> = ({ claimId }) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-6 col-sm-12 col-12 ps-0">
          <ClaimSnapShotComponent />
        </div>
        <div
          className={`col-md-6 col-sm-12 col-12 ${ClaimDetailsCardStyle.messageAndPolicyHolderContainer}`}
        >
          <div className="col-md-6 col-sm-6 col-12">
            <MessagesComponent claimId={claimId} />
          </div>
          <div className="col-md-6 col-sm-6 col-12">
            <PolicyHoldersComponent claimId={claimId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsCardsComponent;
