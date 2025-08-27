export class OrderItemRowDto {
  id!: number;
  productId!: number;
  quantity!: number;
  price!: string;
  product!: {
    id: number;
    title: string | null;
    sku: string | null;
  };
}
