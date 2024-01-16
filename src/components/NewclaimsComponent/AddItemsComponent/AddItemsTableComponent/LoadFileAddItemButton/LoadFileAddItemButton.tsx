import React from "react";
import GenericButton from "@/components/common/GenericButton";
import { useRouter } from "next/navigation";

const LoadFileAddItemButton: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <GenericButton
        label="Load From File"
        size="small"
        type="submit"
        onClickHandler={() => router.push("/upload-items-from-csv")}
      />
    </>
  );
};

export default LoadFileAddItemButton;
