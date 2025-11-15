import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { ProductImage } from '../models/ProductImage';

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  public baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ✅ Add Product
  addProduct(formData: FormData): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/api/Products/Add`,
      formData,
      { headers }
    );
  }

  // ✅ Get All Products
  getAllProducts(): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.get<Product[]>(`${this.baseUrl}/api/Products/GetAll`, { headers });
  }

  // ✅ Get Product By Id
  getProductById(id: number): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.get<Product>(`${this.baseUrl}/api/Products/${id}`, { headers });
  }

  // ✅ Update Product
  updateProduct(id: number, formData: FormData): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/api/Products/${id}`,
      formData,
      { headers }
    );
  }

  // ✅ Delete Product
  deleteProduct(id: number): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/api/Products/${id}`,
      { headers }
    );
  }
  getAllCategories():any{
    return this.http.get<any>(`${this.baseUrl}/api/Master/GetAllCategories`);
  }
 // ✅ Upload Product Image
  uploadProductImage(formData: FormData): Observable<ProductImage> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.post<ProductImage>(
      `${this.baseUrl}/api/Products/ProductImages`,
      formData,
      { headers }
    );
  }

  // ✅ Get Product Images by Product ID
  getProductImages(productId: number): Observable<ProductImage[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.get<ProductImage[]>(
      `${this.baseUrl}/api/ProductImages/byproduct/${productId}`,
      { headers }
    );
  }

  // ✅ Delete Product Image
  deleteProductImage(imageId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.delete<void>(
      `${this.baseUrl}/api/ProductImages/${imageId}`,
      { headers }
    );
  }

  // ✅ Update Product Image Sort Order
  updateProductImageSortOrder(imageId: number, sortOrder: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
    });
    return this.http.put<void>(
      `${this.baseUrl}/api/ProductImages/${imageId}/sortorder`,
      sortOrder,
      { headers }
    );
  }
}