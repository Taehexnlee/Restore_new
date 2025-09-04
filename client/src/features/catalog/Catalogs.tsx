// src/features/catalog/CatalogPage.tsx
import ProductList from './ProductList';
import { Container, Grid2, Typography } from '@mui/material';
import Filters from '../checkout/Filters';
import { useFetchfiltersQuery, useFetchProductsQuery } from './catalogApi';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import AppPagination from '../../app/shared/components/AppPagination';
import { setPageNumber } from './catalogSlice';

export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const productParams = useAppSelector((s) => s.catalog);

  // 제품 + 필터를 상위에서 로딩
  const { data, isLoading } = useFetchProductsQuery(productParams);
  const { data: filtersData, isLoading: filtersLoading } = useFetchfiltersQuery();

  // 로딩 조건 수정: filtersLoading 그대로 사용, !filtersLoading 아님
  if (isLoading || filtersLoading || !data || !filtersData) {
    return <Typography variant="h3">Loading...</Typography>;
  }

  const items = data.items ?? [];
  const pagination = data.pagination ?? null;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6, px: { xs: 2, md: 0 } }}>
      <Typography variant="h3" gutterBottom>Catalog</Typography>

      <Grid2 container spacing={4}>
        {/* 왼쪽: 필터 영역 */}
        <Grid2 size={3}>
          <Filters filtersData={filtersData} />
        </Grid2>

        {/* 오른쪽: 상품 리스트 + 페이지네이션 */}
        <Grid2 size={9}>
          {items.length > 0 ? (
            <>
              <ProductList products={items} />
              {pagination && (
                <AppPagination
                  metadata={pagination}
                  onPageChange={(page: number) => {
                    dispatch(setPageNumber(page));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </>
          ) : (
            <Typography variant="h5">There are no results for this filter.</Typography>
          )}
        </Grid2>
      </Grid2>
    </Container>
  );
}