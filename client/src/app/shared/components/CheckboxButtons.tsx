// src/app/shared/components/CheckboxButtons.tsx
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  items: string[];                // 표시할 항목 목록 (예: brands, types)
  checked: string[];              // 현재 체크된 값들
  onChange: (items: string[]) => void; // 변경 시 부모로 올려줄 콜백
};

export default function CheckboxButtons({ items, checked, onChange }: Props) {
  // 로컬 체크 상태 (부모값과 동기화)
  const [checkedItems, setCheckedItems] = useState<string[]>(checked);

  useEffect(() => {
    setCheckedItems(checked);
  }, [checked]);

  // 토글 핸들러: 이미 있으면 제거, 없으면 추가
  const handleToggle = (value: string) => {
    const updatedChecked =
      checkedItems.includes(value)
        ? checkedItems.filter((v) => v !== value)
        : [...checkedItems, value];

    setCheckedItems(updatedChecked);
    onChange(updatedChecked); // 부모에 변경 사항 전달 (=> Redux dispatch 등)
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