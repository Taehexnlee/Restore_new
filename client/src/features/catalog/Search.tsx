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

  // Create a debounce helper that accepts the raw value instead of the event
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchTerm(value));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    // Clear any pending debounce timers on unmount
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
        const value = e.target.value;   // Extract the raw value
        setTerm(value);                 // Update the local input state
        debouncedSearch(value);         // Trigger the debounced search
      }}
    />
  );
}
