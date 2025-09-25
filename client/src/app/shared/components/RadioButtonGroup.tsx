// src/app/shared/components/RadioButtonGroup.tsx
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { ChangeEvent } from "react";

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  selectedValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function RadioButtonGroup({
  options,
  selectedValue,
  onChange,
  label,
}: Props) {
  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      {label ? <FormLabel sx={{ mb: 1 }}>{label}</FormLabel> : null}
      <RadioGroup
        value={selectedValue}
        onChange={onChange}
        sx={{ my: 0 }} // Keep spacing tight between label and radios
      >
        {options.map(({ value, label: text }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio color="secondary" sx={{ py: 0.7 }} />}
            label={text}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
