// src/features/basket/BasketItem.tsx
import {
    Paper,
    Box,
    Typography,
    IconButton,
  } from "@mui/material";
  import RemoveIcon from "@mui/icons-material/Remove";
  import AddIcon from "@mui/icons-material/Add";
  import CloseIcon from "@mui/icons-material/Close";
import type { Item } from "../models/basket";
import { useAddBasketItemMutation, useRemoveBasketItemMutation } from "./basketApi";
import { currencyFormat } from "../../lib/util";
  
  type Props = {
    item: Item;
  };
  
  export default function BasketItem({ item }: Props) {

    const [removeBasketItem] = useRemoveBasketItemMutation();
    const [addBasketItem] = useAddBasketItemMutation();

    return (
      <Paper
        sx={{
          height: 140,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 2,
          position: "relative",
        }}
      >
        {/* Remove the entire item */}
        <IconButton
          onClick={() => removeBasketItem({productId: item.productId, quantity: item.quantity})}
          size="small"
          color="error"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
  
        {/* Left: image and product details */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={item.pictureUrl}
            alt={item.name}
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 1,
              mr: 2,
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h6">{item.name}</Typography>
  
            {/* Price and line total */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Typography sx={{ fontSize: "1.1rem" }}>
                {currencyFormat(item.price)} × {item.quantity}
              </Typography>
              <Typography color="primary">
                {currencyFormat(item.price * item.quantity)}
              </Typography>
            </Box>
          </Box>
        </Box>
  
        {/* Right: quantity controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => removeBasketItem({productId: item.productId, quantity: 1})}
            size="small"
            color="error"
            sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6">{item.quantity}</Typography>
          <IconButton
            onClick={() => addBasketItem({product: item, quantity: 1})}
            size="small"
            color="success"
            sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  }
