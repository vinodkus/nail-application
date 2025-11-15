import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Category, Product, ProductImage } from '../models/product';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl+ '/api/Products/GetCustomerActiveProducts');
  }
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
     this.baseUrl+ '/api/Products/GetCategories'
    );
  }
  getAllProductsByCategoryId(
    categoryId: number
  ): Observable<ApiResponse<Product[]>> {
    debugger;
    return this.http.get<ApiResponse<Product[]>>(
      `${this.baseUrl}/api/Products/GetCustomerProductsByCatId/?catId=${categoryId}`
    );
  }
//  getProductById(productId: number): Observable<ApiResponse<Product>> {
//   return this.http.get<ApiResponse<Product>>(
//     `${this.baseUrl}/api/Products/${productId}`
//   );
// }
 getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/api/Products/${id}`);
  }
getProductImages(productId: number): Observable<ApiResponse<ProductImage[]>> {
  return this.http.get<ApiResponse<ProductImage[]>>(
    `${this.baseUrl}/api/Products/GetProductImages/${productId}`
  );
}
// Add product image
addProductImage(productId: number, image: File, sortOrder: number = 0): Observable<any> {
  const formData = new FormData();
  formData.append('ProductId', productId.toString());
  formData.append('Image', image);
  formData.append('SortOrder', sortOrder.toString());

  return this.http.post(
    `${this.baseUrl}/api/Products/AddProductImage`,
    formData
  );
}
deleteProductImage(imageId: number): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/api/Products/DeleteProductImage/${imageId}`
  );
}
}
