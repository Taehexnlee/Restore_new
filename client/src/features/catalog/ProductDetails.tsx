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

  // 현재 장바구니에 동일 상품 있으면 찾아오기
  const item: Item | undefined = basket?.items.find(
    (i) => i.productId === productId
  );

  // 수량: controlled input
  const [quantity, setQuantity] = useState<number>(0);

  // 상품이 장바구니에 있으면 초기 수량 동기화, 없으면 0
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

  // 입력 변경(음수 방지)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +e.currentTarget.value;
    if (val >= 0) setQuantity(val);
  };

  // 장바구니 업데이트(증가/감소/삭제)
  const handleUpdateBasket = async () => {
    if (!product) return;

    // 변경량(절댓값): 장바구니에 없음 => quantity, 있으면 |quantity - item.quantity|
    const diff = Math.abs(item ? quantity - item.quantity : quantity);

    if (diff === 0) return;

    if (!item || quantity > item.quantity) {
      // 새로 담거나 수량 증가
      await addBasketItem({ product: item ?? product, quantity: diff });
    } else {
      // 수량 감소/삭제
      await removeBasketItem({ productId: product.id, quantity: diff });
    }
  };

  // 버튼 라벨/비활성화 조건
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
              value={quantity}            // ← controlled
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