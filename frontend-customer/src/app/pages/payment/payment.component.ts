import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { 
  OrderService, 
  PaymentRequest, 
  UpdateOrderPaymentRequest 
} from '../../services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  orderId!: number;
  totalAmount!: number;
  transactionId: string = '';
  paymentDate: string = '';
  paidAmount!: number;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.totalAmount = Number(this.route.snapshot.paramMap.get('amount'));
    this.paidAmount = this.totalAmount;
    
    // Set current date/time as default
    this.paymentDate = this.getCurrentLocalDateTimeString();
  }
private getCurrentLocalDateTimeString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
  async verifyPayment(): Promise<void> {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    try {
      // First upload screenshot if available
      let screenshotUrl = '';
      if (this.selectedFile) {
        screenshotUrl = await this.uploadScreenshot();
      }

      // Submit payment details
      const paymentData: PaymentRequest = {
        orderId: this.orderId,
        transactionId: this.transactionId,
        paymentDate: this.paymentDate,
        paidAmount: this.paidAmount,
        paymentMethod: 'UPI',
        status: 'pending_verification',
        screenshotUrl: screenshotUrl
      };

      this.orderService.submitPayment(paymentData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          alert('Payment details submitted successfully! We will verify and confirm your order shortly.');
          this.router.navigate(['/payment-under-verification', this.orderId]);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Payment submission error:', error);
          alert('Error submitting payment. Please try again.');
        }
      });

    } catch (error) {
      this.isSubmitting = false;
      console.error('Error in payment process:', error);
      alert('Error processing payment. Please try again.');
    }
  }

  selectCOD(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    const paymentData: UpdateOrderPaymentRequest = {
      orderId: this.orderId,
      paymentMethod: 'COD',
      status: 'confirmed'
    };

    this.orderService.updateOrderPayment(this.orderId, paymentData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.router.navigate(['/order-confirmation', this.orderId]);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('COD selection error:', error);
        alert('Error selecting COD. Please try again.');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG)');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      this.selectedFile = file;
    }
  }

  private uploadScreenshot(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve('');
        return;
      }

      this.orderService.uploadPaymentScreenshot(this.selectedFile, this.orderId)
        .subscribe({
          next: (response: any) => {
            resolve(response.fileUrl);
          },
          error: (error) => {
            console.error('Screenshot upload failed:', error);
            resolve(''); // Continue without screenshot
          }
        });
    });
  }
}