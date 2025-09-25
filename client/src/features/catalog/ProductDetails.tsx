import { useParams } from "react-router-dom";
import {
  Button,
  Divider,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";
import {
  useAddBasketItemMutation,
  useFetchBasketQuery,
  useRemoveBasketItemMutation,
} from "../../app/basket/basketApi";
import type { Item } from "../../app/models/basket";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = +(id ?? 0);

  const { data: product, isLoading } = useFetchProductDetailsQuery(productId);
  const { data: basket } = useFetchBasketQuery();
  const [addBasketItem] = useAddBasketItemMutation();
  const [removeBasketItem] = useRemoveBasketItemMutation();

  // Locate the matching item in the current basket
  const item: Item | undefined = basket?.items.find(
    (i) => i.productId === productId
  );

  // Manage product quantity via a controlled input
  const [quantity, setQuantity] = useState<number>(0);

  // Synchronize the field with basket quantity, defaulting to zero
  useEffect(() => {
    setQuantity(item ? item.quantity : 0);
  }, [item]);

  if (!product || isLoading) return <div>Loading...</div>;

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in stock", value: product.quantityInStock },
  ];

  // Handle manual input changes while preventing negative values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +e.currentTarget.value;
    if (val >= 0) setQuantity(val);
  };

  // Apply basket updates (add, increase, or decrease)
  const handleUpdateBasket = async () => {
    if (!product) return;

    // Absolute difference: new desired quantity minus current basket quantity
    const diff = Math.abs(item ? quantity - item.quantity : quantity);

    if (diff === 0) return;

    if (!item || quantity > item.quantity) {
      // Add an item or increase its quantity
      await addBasketItem({ product: item ?? product, quantity: diff });
    } else {
      // Decrease quantity or remove the item
      await removeBasketItem({ productId: product.id, quantity: diff });
    }
  };

  // Determine button label and disabled state
  const noChange = (item && quantity === item.quantity) || (!item && quantity === 0);
  const buttonLabel = item ? "Update Quantity" : "Add to basket";

  return (
    <Grid2 container spacing={6} sx={{ maxWidth: "lg", mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>

        <TableContainer sx={{ "& td": { fontSize: "1rem" }, mt: 2 }}>
          <Table>
            <TableBody>
              {productDetails.map((d, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: "bold" }}>{d.label}</TableCell>
                  <TableCell>{d.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid2 container spacing={2} sx={{ mt: 3 }}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              value={quantity}            // Controlled input value
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              sx={{ height: 55 }}
              disabled={noChange}
              onClick={handleUpdateBasket}
            >
              {buttonLabel}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
