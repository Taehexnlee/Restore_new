// src/lib/hooks/useBasket.ts
import { useClearBasketMutation, useFetchBasketQuery } from "../../app/basket/basketApi";

export function useBasket() {
  const { data: basket } = useFetchBasketQuery();
  const [clearBasket] = useClearBasketMutation();


  const subtotal =
    basket?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  // Orders above $100 (10,000 cents) ship free; otherwise charge $5 (500 cents)
  const deliveryFee = subtotal > 10000 ? 0 : 500;

  const total = subtotal + deliveryFee;

  return { basket, subtotal, deliveryFee, total, clearBasket};
}
