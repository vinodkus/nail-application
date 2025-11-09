import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-payment-under-verification',
  imports: [DatePipe],
  templateUrl: './payment-under-verification.component.html',
  styleUrl: './payment-under-verification.component.css'
})
export class PaymentUnderVerificationComponent implements OnInit{
    orderId!: number;
  orderNumber: string = '';
  totalAmount: number = 0;
  transactionId: string = '';
  paymentDate: string = '';
  /**
   *
   */
  constructor(private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService) {
    
  }
 ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.orderNumber = 'ORD-' + this.orderId;
    this.loadPaymentDetails();
  }
  loadPaymentDetails(): void {
    this.orderService.getPaymentStatus(this.orderId).subscribe({
      next: (paymentStatus) => {
        this.transactionId = paymentStatus.transactionId || 'N/A';
        this.totalAmount = paymentStatus.paidAmount;
        this.paymentDate = paymentStatus.paymentDate 
          ? new Date(paymentStatus.paymentDate).toLocaleDateString() 
          : 'N/A';
      },
      error: (error) => {
        console.error('Error loading payment details:', error);
      }
    });
  }

   viewOrderHistory(): void {
    this.router.navigate(['/orders']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
