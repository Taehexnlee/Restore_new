// src/features/catalog/Search.tsx
import { TextField } from "@mui/material";
import { debounce } from "@mui/material/utils";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setSearchTerm } from "./catalogSlice";

export default function Search() {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((s) => s.catalog.searchTerm);

  const [term, setTerm] = useState<string>(searchTerm ?? "");

  useEffect(() => {
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  // ✅ 이벤트가 아닌 '값'을 받도록 디바운스 함수 정의
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchTerm(value));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    // 컴포넌트 언마운트시 디바운스 타이머 정리
    return () => {
      debouncedSearch.clear?.();
    };
  }, [debouncedSearch]);

  return (
    <TextField
      type="search"
      label="Search products"
      variant="outlined"
      fullWidth
      value={term}
      onChange={(e) => {
        const value = e.target.value;   // <- 값만 꺼냄
        setTerm(value);                 // 로컬 입력값 업데이트
        debouncedSearch(value);         // <- 값만 디바운스로 전달
      }}
    />
  );
}