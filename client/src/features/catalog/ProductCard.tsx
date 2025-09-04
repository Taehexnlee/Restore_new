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
        width: '100%',          // ✅ 칸에 맞춰 가로 100%
        height: '100%',         // ✅ 그리드 아이템 높이에 맞춰 늘림(세로 균등)
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardMedia
        sx={{ height: 240, backgroundSize: 'cover' }}
        image={product.pictureUrl} // 서버 필드명에 맞춰 사용
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

      {/* ✅ 버튼 레이아웃 정리 */}
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