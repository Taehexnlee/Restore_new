// src/app/shared/components/CheckboxButtons.tsx
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  items: string[];                // Items to render (e.g., brands, types)
  checked: string[];              // Values currently selected
  onChange: (items: string[]) => void; // Notify parent of selection changes
};

export default function CheckboxButtons({ items, checked, onChange }: Props) {
  // Local selection state synchronized with the parent value
  const [checkedItems, setCheckedItems] = useState<string[]>(checked);

  useEffect(() => {
    setCheckedItems(checked);
  }, [checked]);

  // Toggle handler: remove if already selected, otherwise add
  const handleToggle = (value: string) => {
    const updatedChecked =
      checkedItems.includes(value)
        ? checkedItems.filter((v) => v !== value)
        : [...checkedItems, value];

    setCheckedItems(updatedChecked);
    onChange(updatedChecked); // Propagate changes upward (e.g., Redux dispatch)
  };

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              color="secondary"
              checked={checkedItems.includes(item)}
              onClick={() => handleToggle(item)}
              sx={{ py: 0.7 }}
            />
          }
          label={item}
          sx={{ py: 0.7 }}
        />
      ))}
    </FormGroup>
  );
}
