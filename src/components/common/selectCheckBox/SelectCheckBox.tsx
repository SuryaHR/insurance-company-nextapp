"use client";

import GenericSelect from "../GenericSelect/index";

export default function SelectCheckBox(props: { options: any; className?: string }) {
  return (
    <GenericSelect
      formControlClassname={props?.className}
      isMulti
      options={props.options}
      isManditaory={false}
    />
  );
}
