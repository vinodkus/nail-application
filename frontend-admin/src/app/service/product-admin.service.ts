import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';

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

  
}
