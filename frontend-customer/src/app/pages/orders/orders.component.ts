import { Component, OnInit } from '@angular/core';
import { OrderResponse, OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-orders',
  imports: [NgIf, NgClass,NgFor,DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
customerId!:number;
orderDetails: OrderResponse[]=[];
totalAmount: number = 0;
loading:boolean=true;
baseUrl = environment.apiBaseUrl;
filteredOrders: OrderResponse[] = [];
currentFilter: string = 'all';
allOrders: OrderResponse[] = [];
constructor(private route:ActivatedRoute, private orderService: OrderService
, private router: Router

) {}
ngOnInit(): void {
  debugger;
    this.customerId = Number(this.route.snapshot.paramMap.get('customerId')); // URL से orderId ले रहा है
    this.getCustomerAllOrders();
  }
getCustomerAllOrders(): void {
  debugger;
    this.orderService.getCustomerAllOrders(this.customerId).subscribe({
      next: (data) => {
        this.allOrders = data;
        this.filteredOrders = data;
        // this.orderDetails = data;
        debugger;      
        this.loading=false;
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.loading=false;
      }
    });
  }
filterOrders(filter: string): void {
  debugger;
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredOrders = this.allOrders;
    } else {
      this.filteredOrders = this.allOrders.filter(order => {
        switch (filter) {
          case 'pending_verification':
            return order.status === 9; // PaymentPendingVerification
          case 'confirmed':
            return order.status === 1 || order.status === 10; // Processing or PaymentVerified
          case 'delivered':
            return order.status === 5; // Delivered
          default:
            return true;
        }
      });
    }
  }
 getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Processing', 
      2: 'Completed',
      3: 'Cancelled',
      4: 'Shipped',
      5: 'Delivered',
      6: 'Returned',
      7: 'Refunded',
      8: 'On Hold',
      9: 'Payment Pending Verification',
      10: 'Payment Verified',
      11: 'Payment Failed'
    };
    return statusMap[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const classMap: { [key: number]: string } = {
      0: 'status-pending',
      1: 'status-processing',
      2: 'status-completed',
      3: 'status-cancelled',
      4: 'status-shipped',
      5: 'status-delivered',
      6: 'status-returned',
      7: 'status-refunded',
      8: 'status-onhold',
      9: 'status-payment-pending',
      10: 'status-payment-verified',
      11: 'status-payment-failed'
    };
    return classMap[status] || 'status-pending';
  }

getProductImageUrl(imageUrl: string): string {
  if (!imageUrl) {
    return 'https://via.placeholder.com/80';
  }
  
  // Agar image URL already complete URL hai
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Agar relative path hai toh base URL add karein
  return `${this.baseUrl}/products/${imageUrl.replace(/^\//, '')}`;
}
formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
   viewOrderDetails(orderId: number): void {
    this.router.navigate(['/order-details', orderId]);
  }
  checkVerificationStatus(orderId: number): void {
    // You can show a modal or redirect to verification status page
    alert('Payment verification is in process. Please check back in 2-4 hours.');
    
    // Or redirect to a dedicated status page
    // this.router.navigate(['/payment-status', orderId]);
  }
continueShopping(): void {
    this.router.navigate(['/products']);
  }
  // Add this method to your OrdersComponent
getSizeBadgeClass(size: string): string {
  const sizeMap: { [key: string]: string } = {
    'XS': 'size-badge-xs',
    'S': 'size-badge-s', 
    'M': 'size-badge-m',
    'L': 'size-badge-l'
  };
  return sizeMap[size] || 'size-badge-m';
}
}
