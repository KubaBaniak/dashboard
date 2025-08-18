export type ProductRowDto = {
  id: number;
  title: string;
  sku: string;
  price: string;
  stockQuantity: number;
  categories: { id: number; name: string }[];
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  data: ProductRowDto[];
  page: number;
  pageSize: number;
  total: number;
};
