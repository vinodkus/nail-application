import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
    private baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }
  // ✅ Get All Orders
  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/Orders/GetAllOrders`);
  }


updateOrderStatus(orderId: number, status: string) {
  const st=status=='Pending'?0:status=='Processing'?1:status=='Completed'?2:status=='Cancelled'?3:status=='Shipped'?4:status=='Delivered'?5:status=='Returned'?6:status=='Refunded'?7:status=='OnHold'?8:status=='PaymentPendingVerification'?9:status=='PaymentVerified'?10:11;
  
  return this.http.patch(
    `${this.baseUrl}/api/orders/${orderId}/status`,
    { Status:st } 
    ,{
      headers: { 'Content-Type': 'application/json' }
    }
  );
}


}
