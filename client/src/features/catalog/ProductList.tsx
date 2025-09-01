// src/features/catalog/ProductList.tsx
import { Box } from '@mui/material';
import ProductCard from './ProductCard';
import type { Product } from '../../app/models/product';

type Props = { products: Product[] };

export default function ProductList({ products }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,                // spacing * 3 (기본 8px → 24px)
        justifyContent: 'center',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Box>
  );
}