import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService, PlaceOrderResponse } from '../../services/order.service';
import { NgForm } from '@angular/forms';
import { MatModule } from '../../appModules/mat.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [MatModule],
})
export class CheckoutComponent implements OnInit {
  customerEmail = '';
  customerName = '';
  customerId = '';
  cartItems: CartItem[] = [];
  fullName = '';
  address = '';
  mobile = '';
  promoCode = '';
  discount = 0;
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
    });

    this.authService.customerEmail$.subscribe((email) => {
      this.customerEmail = email || '';
    });

    this.authService.customerId$.subscribe((id) => {
      this.customerId = id || '';
    });

    this.authService.customerName$.subscribe((name) => {
      this.customerName = name || '';
      this.fullName = this.customerName;
    });
  }

  getTotalAmount(): number {
    const total = this.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
    return total - this.discount;
  }

  applyPromoCode() {
    if (this.promoCode.trim().toLowerCase() === 'save10') {
      this.discount = 10;
      this.totalAmount= this.totalAmount-this.discount;
      this.snackBar.open('Promo code applied: ₹10 off!', '', {
        duration: 3000,
      });
    } else {
      this.discount = 0;
      this.snackBar.open('Invalid promo code.', '', { duration: 3000 });
    }
  }

  placeOrder(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open('Please fill all required fields.', '', {
        duration: 3000,
      });
      return;
    }

    this.totalAmount = this.getTotalAmount();
    
    const orderPayload = {
      customerId: this.customerId,
      customerName: this.fullName,
      customerEmail: this.customerEmail,
      address: this.address,
      phoneNumber: this.mobile,
      totalAmount: this.totalAmount,
      orderDate: new Date().toISOString(),
      orderItems: this.cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
        nailSize: item.nailSize 
      })),
    };

    this.orderService.placeOrder(orderPayload).subscribe({
      next: (res: PlaceOrderResponse) => {
        // Show order number in success message
        this.snackBar.open(`Order placed successfully! Order #: ${res.orderNumber}`, '', {
          duration: 5000, // Increased duration to read order number
        });
        
        this.cartService.clearCart();
        
        // Navigate to payment page with orderId and totalAmount
        this.router.navigate(['/payment', res.orderId, this.totalAmount]);
      },
      error: (err) => {
        console.error('Order placement failed:', err);
        this.snackBar.open('Failed to place order. Please try again.', '', {
          duration: 3000,
        });
      },
    });
  }
}