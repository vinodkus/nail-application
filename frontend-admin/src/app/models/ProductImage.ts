export interface ProductImage {
  productImageId: number;
  productId: number;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdDate?: string;
}