// 금액은 센트 단위(정수)로 들어온다고 가정합니다.
export function currencyFormat(amount: number) {
    return `$${(amount / 100).toFixed(2)}`;
  }