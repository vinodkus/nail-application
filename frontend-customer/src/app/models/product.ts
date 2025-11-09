export interface Product {
productId: number;
productSku: string;
productName: string;

productPrice: number;
productShortName: string;
productDescription: string;

deliveryTimeSpan: string;
categoryId: number;
categoryName: string;

productImageUrl: string;
createdDate: string;
isActive: boolean;
additionalImages?: ProductImage[]; // Add this

}

export interface ProductApiResponse{
message: string;
result:boolean;
data:Product[];
}

export interface Category{
categoryId: number;
categoryName: string;
}

export interface ApiResponse<T> {
  result: boolean;
  message: string;
  data: T;
}

export interface Customer{
  customerID: number;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  productImageUrl: string;
  categoryName: string;
  nailSize: string; 
}
export interface ProductImage {
  productImageId: number;
  productId: number;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}