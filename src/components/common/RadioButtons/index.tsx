import React from "react";
import RadioButtonstyle from "./RadioButton.module.scss";
import clsx from "clsx";
// { ChangeEvent }

interface RadioButtonProps {
  value: string;
  label: string;
  formControlClassname?: string;
}

interface RadioButtonsProps {
  options: RadioButtonProps[];
  selectedOption: string | null;
  onChange: (value: string) => void;
  formControlClassname?: string;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  options,
  selectedOption,
  onChange,
  formControlClassname = "",
}) => {
  // selectedOption, onChange
  return (
    <div 
    className={clsx({
      [formControlClassname]: formControlClassname,
    })}
    >
      {options.map((option) => (
        <label key={option.value} className={RadioButtonstyle.marginRight}>
          <input
            type="radio"
            value={option.value}
            className={RadioButtonstyle.marginRight}
            checked={selectedOption === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtons;
