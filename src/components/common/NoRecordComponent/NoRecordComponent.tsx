import NoRecordStyle from "./no-record.module.scss";
import clsx from "clsx";

type NoRecordType = {
  message: string | any;
  textLeftClass?: boolean | false;
};

const NoRecordComponent: React.FC<NoRecordType> = ({ message, textLeftClass }) => {
  return (
    <div
      className={clsx(
        textLeftClass ? NoRecordStyle.textLeftAlign : NoRecordStyle.noRecordContent
      )}
    >
      {message}
    </div>
  );
};

export default NoRecordComponent;
