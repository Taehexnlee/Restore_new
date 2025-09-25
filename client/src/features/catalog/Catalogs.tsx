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

  // Fetch products and filter metadata together
  const { data, isLoading } = useFetchProductsQuery(productParams);
  const { data: filtersData, isLoading: filtersLoading } = useFetchfiltersQuery();

  // Guard on isLoading/filtersLoading without negating the filter flag
  if (isLoading || filtersLoading || !data || !filtersData) {
    return <Typography variant="h3">Loading...</Typography>;
  }

  const items = data.items ?? [];
  const pagination = data.pagination ?? null;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6, px: { xs: 2, md: 0 } }}>
      <Typography variant="h3" gutterBottom>Catalog</Typography>

      <Grid2 container spacing={4}>
        {/* Left column: filter controls */}
        <Grid2 size={3}>
          <Filters filtersData={filtersData} />
        </Grid2>

        {/* Right column: product list and pagination */}
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
