
import ProductList from './ProductList';
import { Container } from '@mui/material';
import { useFetchProductsQuery } from './catalogApi';


export default function Catalog() {
  const { data, isLoading } = useFetchProductsQuery();

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <Container maxWidth="xl" sx={{ mt: 14 }}>
      <ProductList products={data} />
    </Container>
  );
}