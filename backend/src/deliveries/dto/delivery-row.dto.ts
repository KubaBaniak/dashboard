export class DeliveryRowDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  deliveredAt: string;
  note: string | null;
}
