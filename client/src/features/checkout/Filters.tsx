// src/features/checkout/Filters.tsx
import { Box, Button, Paper, Typography } from "@mui/material";
import Search from "../catalog/Search";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setOrderBy, setBrands, setTypes, resetParams } from "../catalog/catalogSlice";

const sortOptions = [
  { value: "name",      label: "Alphabetical" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "price",     label: "Price: Low to High" },
];

// 상위에서 내려주는 필터 데이터 타입
type FiltersData = { brands: string[]; types: string[] };
type Props = { filtersData: FiltersData };

export default function Filters({ filtersData }: Props) {
  const dispatch = useAppDispatch();
  const { orderBy, brands, types } = useAppSelector((s) => s.catalog);

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* 검색 */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Search />
      </Paper>

      {/* 정렬 */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <RadioButtonGroup
          label="Sort by"
          options={sortOptions}
          selectedValue={orderBy}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
        />
      </Paper>

      {/* 브랜드 필터 */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Brands</Typography>
        <CheckboxButtons
          items={filtersData.brands}
          checked={brands}
          onChange={(vals: string[]) => dispatch(setBrands(vals))}
        />
      </Paper>

      {/* 타입 필터 */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Types</Typography>
        <CheckboxButtons
          items={filtersData.types}
          checked={types}
          onChange={(vals: string[]) => dispatch(setTypes(vals))}
        />
      </Paper>

      {/* 리셋 */}
      <Button variant="outlined" color="inherit" onClick={() => dispatch(resetParams())}>
        Reset filters
      </Button>
    </Box>
  );
}