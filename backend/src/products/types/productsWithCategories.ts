import { Product } from "@prisma/client";

type ProductRowPersistence = Product & {
  categories: { id: number; name: string }[];
};

export type QueryProductsResult = {
  total: number;
  rows: ProductRowPersistence[];
};
