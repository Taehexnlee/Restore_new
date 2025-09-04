// src/features/catalog/ProductList.tsx
import { Grid2 } from '@mui/material';
import ProductCard from './ProductCard';
import type { Product } from '../../app/models/product';

type Props = { products: Product[] };

export default function ProductList({ products }: Props) {
  return (
    <Grid2 container spacing={3} sx={{ display: "flex" }}>
    {products.map((p) => (
      <Grid2 key={p.id} size={3}>
        <ProductCard product={p} />
      </Grid2>
    ))}
  </Grid2>
);
}