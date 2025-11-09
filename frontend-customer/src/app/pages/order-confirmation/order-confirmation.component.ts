import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  private baseUrl = environment.apiBaseUrl;

  orderId!: number;
  // orderDetails!: OrderConfirmationDto;
  orderDetails!: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.loadOrderConfirmation();
  }

  loadOrderConfirmation(): void {
    this.orderService.getOrderConfirmation(this.orderId).subscribe({
      next: (data) => {
        this.orderDetails = data;
        debugger;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order confirmation:', error);
        this.loading = false;
      }
    });
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
      8: 'On Hold'
    };
    return statusMap[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const classMap: { [key: number]: string } = {
      0: 'bg-warning',
      1: 'bg-info',
      2: 'bg-success',
      3: 'bg-danger',
      4: 'bg-primary',
      5: 'bg-success',
      6: 'bg-secondary',
      7: 'bg-dark',
      8: 'bg-warning'
    };
    return classMap[status] || 'bg-secondary';
  }

  getProductImageUrl(imageUrl: string): string {
    debugger;
    // if (!imageUrl) {
    //   return 'https://via.placeholder.com/80';
    // }
    
    // if (imageUrl.startsWith('http')) {
    //   return imageUrl;
    // }
    
    // Assuming you have baseUrl in environment
    return `${environment.apiBaseUrl}/products/${imageUrl.replace(/^\//, '')}`;
  }

  // getSubtotal(): number {
  //   if (!this.orderDetails?.items) return 0;
  //   return this.orderDetails.items.reduce((total, item) => 
  //     total + (item.productPrice * item.quantity), 0);
  // }

  // getTaxAmount(): number {
  //   if (!this.orderDetails?.totalAmount) return 0;
  //   const subtotal = this.getSubtotal();
  //   return this.orderDetails.totalAmount - subtotal;
  // }
getEstimatedDelivery(): string {
  return '3-5 Business Days';
}
  // getEstimatedDelivery(): string {
  //   if (!this.orderDetails?.items || this.orderDetails.items.length === 0) {
  //     return '3-5 Business Days';
  //   }
    
  //   // Find the maximum delivery time from all products
  //   const deliveryTimes = this.orderDetails.items
  //     .filter(item => item.deliveryTimeSpan)
  //     .map(item => {
  //       const match = item.deliveryTimeSpan.match(/\d+/);
  //       return match ? parseInt(match[0]) : 0;
  //     });
    
  //   const maxDays = Math.max(...deliveryTimes, 5);
  //   return `${maxDays} Business Days`;
  // }

  downloadInvoice(): void {
    // Implement invoice download logic
    console.log('Downloading invoice for order:', this.orderId);
    // this.orderService.downloadInvoice(this.orderId).subscribe(...);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrderHistory(): void {
    this.router.navigate(['/orders']);
  }
}