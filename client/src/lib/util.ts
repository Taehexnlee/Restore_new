// src/lib/util.ts

// ✅ 쿼리 스트링 보낼 때 비어있는 값 제거
export function filterEmptyValues(values: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => {
      if (v === undefined || v === null) return false;
      if (typeof v === 'string') return v.trim() !== '';  // 문자열은 공백만이면 제거
      if (Array.isArray(v)) return v.length > 0;          // 배열은 길이 0이면 제거
      return true;                                        // number/boolean 등은 유지
    })
  );
}

// ✅ 가격 포맷 함수 (강의에서 사용했던 부분)
// ✅ 가격 포맷 함수 (센트 단위 → 달러 변환)
export function currencyFormat(amount: number) {
  return `$${(amount / 100).toFixed(2)}`;
}