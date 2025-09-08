import type { Order, ShippingAddress, PaymentSummary } from "../app/models/order";


/** 통화 포맷: cents → $x,xxx.xx */
export const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
// Backwards-compatible alias (if some code uses `currencyFormat`)
export const currencyFormat = formatCurrency;

/** 주문 타입에서 배송지 뽑아 문자열로 */
export function formatAddressFromOrder(order?: Pick<Order, "shippingAddress">) {
  if (!order?.shippingAddress) return "";
  return formatAddress(order.shippingAddress);
}

/** ShippingAddress → 한 줄 문자열 */
export function formatAddress(addr?: ShippingAddress) {
  if (!addr) return "";
  const parts = [
    addr.name,
    addr.line1,
    addr.line2,
    addr.city,
    addr.state,
    addr.postal_code,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ");
  return parts;
}

/** 주문 타입에서 결제 요약 뽑아 문자열로 */
export function formatPaymentFromOrder(order?: Pick<Order, "paymentSummary">) {
  return formatPayment(order?.paymentSummary);
}
/** 객체에서 값이 null/undefined/빈 문자열인 속성을 제거 */
export function filterEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") {
      // Preserve key types without using `any`
      result[key] = value as T[Extract<keyof T, string>];
    }
  }
  return result;
}

/** PaymentSummary → “VISA •••• 4242  (MM/YY)” */
export function formatPayment(summary?: PaymentSummary) {
  if (!summary) return "";
  const last4 =
    typeof summary.last4 === "string"
      ? summary.last4
      : String(summary.last4 ?? "");
  const mm = String(summary.expMonth ?? "").padStart(2, "0");
  const yyStr = String(summary.expYear ?? "");
  const yy = yyStr.length === 4 ? yyStr.slice(2) : yyStr;

  return `${summary.brand?.toUpperCase() ?? "CARD"} •••• ${last4}  (${mm}/${yy})`;
}
