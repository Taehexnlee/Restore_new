// src/app/models/user.ts
export type User = {
    email: string;
    roles: string[];
  };

  // Add additional user-related types alongside this declaration
export type Address = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string; // Matches the API contract key name
  country: string;     // ISO 2-letter (e.g. 'US', 'GB')
};
