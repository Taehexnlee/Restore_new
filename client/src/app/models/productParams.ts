// src/app/models/productParams.ts
export type ProductParams = {
    orderBy: string;           // "name" | "price" | "priceDesc" 등
    searchTerm: string;
    types: string[];
    brands: string[];
    pageNumber: number;
    pageSize: number;
  };