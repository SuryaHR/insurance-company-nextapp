import { useState } from "react";

type TypedOption<T> = T;

export type OptionTypedList<T> = TypedOption<T>[];

function useSelectOption<T extends object>(originalOption: OptionTypedList<T>) {
  const [options, setOptions] = useState(originalOption);

  const filterOption = (
    selected: TypedOption<T>,
    filterBy: keyof TypedOption<T>
  ) => {
    if (selected === null) {
      setOptions(originalOption);
    }
    const filteredOption = originalOption.filter(
      (option) => option[filterBy] !== selected[filterBy]
    );
    setOptions(filteredOption);
  };

  return { options, filterOption };
}

export default useSelectOption;
