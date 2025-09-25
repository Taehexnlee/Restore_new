// src/features/catalog/ProductCard.tsx
import {
  Card, CardMedia, CardContent, CardActions, Typography, Button, Box
} from '@mui/material';
import type { Product } from '../../app/models/product';
import { Link } from 'react-router-dom';
import { useAddBasketItemMutation } from '../../app/basket/basketApi';
import { currencyFormat } from '../../lib/util';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const [addBasketItem, { isLoading }] = useAddBasketItemMutation();

  return (
    <Card
      elevation={3}
      sx={{
        width: '100%',          // Fill the available column width
        height: '100%',         // Stretch to match grid item height
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardMedia
        sx={{ height: 240, backgroundSize: 'cover' }}
        image={product.pictureUrl} // Mirror server field naming
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
          {product.name}
        </Typography>
        <Typography variant="h6" color="secondary.main">
          {currencyFormat(product.price)}
        </Typography>
      </CardContent>

      {/* Button layout */}
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button
            disabled={isLoading}
            onClick={() => addBasketItem({ product, quantity: 1 })}
            size="small"
            variant="contained"
            color="primary"
          >
            Add to Cart
          </Button>
          <Button
            component={Link}
            to={`/catalog/${product.id}`}
            variant="outlined"
            size="small"
          >
            View
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
