// src/app/models/productParams.ts
export type ProductParams = {
    orderBy: string;           // e.g. "name", "price", "priceDesc"
    searchTerm: string;
    types: string[];
    brands: string[];
    pageNumber: number;
    pageSize: number;
  };
