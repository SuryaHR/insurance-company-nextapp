import React from "react";
import SearchBox from "@/components/common/SearchBox/SearchBox";

function InsAdminSearchBox() {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
  };
  const searchKey = async () => {};
  return (
    <div>
      <SearchBox
        onChange={handleSearch}
        onKeyDown={searchKey}
        value={searchValue}
        placeholder={"Search..."}
      />
    </div>
  );
}

export default InsAdminSearchBox;
