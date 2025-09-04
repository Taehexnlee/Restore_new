// src/app/shared/components/AppPagination.tsx
import { Box, Typography, Pagination as MuiPagination } from "@mui/material";
import type { Pagination as PaginationMeta } from "../../models/pagination";

type Props = {
  metadata: PaginationMeta;
  onPageChange: (page: number) => void;
};

export default function AppPagination({ metadata, onPageChange }: Props) {
  const { currentPage, totalPages, pageSize, totalCount } = metadata;

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Box
      mt={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
    >
      <Typography variant="body2" color="text.secondary">
        {`${startItem}–${endItem} of ${totalCount} items`}
      </Typography>

      <MuiPagination
        color="secondary"
        size="large"
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
      />
    </Box>
  );
}