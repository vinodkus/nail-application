import { ProductImage } from "./ProductImage";

export interface Product {
  id?: number;
  productId:number;
    productSku: string;
    productName: string;
    productPrice: number;
    productShortName: string;
    productDescription: string;
    deliveryTimeSpan: string;
    categoryId: number;   
    categoryName:string;
    image?: File; 
    productImageUrl:string;
    isActive: boolean;
    additionalImages?: ProductImage[]; // Add this property
}