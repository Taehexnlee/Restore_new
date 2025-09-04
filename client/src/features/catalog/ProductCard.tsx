// src/features/catalog/ProductCard.tsx
import {
    Card, CardMedia, CardContent, CardActions, Typography, Button
  } from '@mui/material';
import type { Product } from '../../app/models/product';
import { Link } from 'react-router-dom';
import { useAddBasketItemMutation } from '../../app/basket/basketApi';
import { currencyFormat } from '../../lib/util';
  
  type Props = { product: Product };
  
  export default function ProductCard({ product }: Props) {
    
    const [addBasketItem, {isLoading}] = useAddBasketItemMutation();

    return (
      <Card
        elevation={3}
        sx={{
          width: 280,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardMedia
          sx={{ height: 240, backgroundSize: 'cover' }}
          image={product.pictureUrl}         // 서버 필드명에 맞춰 사용
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
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            disabled={isLoading}
            onClick={() => addBasketItem({product, quantity:1})} size="small">Add to cart</Button>
          <Button
          component={Link}
          to={`/catalog/${product.id}`}
          variant="outlined"
          > View</Button>
        </CardActions>
      </Card>
    );
  }