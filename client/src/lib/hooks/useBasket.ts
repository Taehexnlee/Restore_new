// src/lib/hooks/useBasket.ts
import { useClearBasketMutation, useFetchBasketQuery } from "../../app/basket/basketApi";

export function useBasket() {
  const { data: basket } = useFetchBasketQuery();
  const [clearBasket] = useClearBasketMutation();


  const subtotal =
    basket?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  // $100(=10000cents) 이상 무료배송, 아니면 $5(=500 cents)
  const deliveryFee = subtotal > 10000 ? 0 : 500;

  const total = subtotal + deliveryFee;

  return { basket, subtotal, deliveryFee, total, clearBasket};
}