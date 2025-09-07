// src/app/models/user.ts
export type User = {
    email: string;
    roles: string[];
  };

  // ...기존 User 등 타입들 위/아래 아무데나 추가
export type Address = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string; // ⬅️ 강의와 동일한 키 이름
  country: string;     // ISO 2-letter (e.g. 'US', 'GB')
};