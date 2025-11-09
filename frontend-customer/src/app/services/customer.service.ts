import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/product';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  addCustomer(customer: Customer) {
    return this.http.post(this.baseUrl + '/api/Customer/register', customer);    
  }
  loginCustomer(customer:Customer){
    return this.http.post<Customer>(this.baseUrl + '/api/Customer/login', customer);
  }
 getCustomerOrders(customerId:string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/api/Customer/GetCustomerOrders/${customerId}`);
  }
 forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Customer/ForgotPassword`, { email });
  }
  resetPassword(resetData: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/api/Customer/ResetPassword`, resetData);
}
}
