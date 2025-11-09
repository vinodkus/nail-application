import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatModule } from '../../appModules/mat.module';
import { CartItem } from '../../models/product';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { environment } from '../../../environments/environment';
import { NailSizeGuideComponent } from '../nail-size-guide/nail-size-guide.component';

declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  imports: [MatModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  public baseUrl = environment.apiBaseUrl;
  
  cartItems: any[] = [];
  isVisible: boolean = false;
  
  // Add ViewChild to reference the modal
  @ViewChild('nailSizeGuideModal') nailSizeGuideModal!: ElementRef;
  private modalInstance: any;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => (this.cartItems = items));
    this.cartService.cartVisible$.subscribe((show) => (this.isVisible = show));
  }

  ngAfterViewInit(): void {
    // Initialize modal after view is ready
    if (this.nailSizeGuideModal) {
      this.modalInstance = new bootstrap.Modal(this.nailSizeGuideModal.nativeElement, {
        backdrop: true, // Enable backdrop
        keyboard: true, // Enable ESC key to close
        focus: true // Focus on modal when opened
      });
    }
  }

openNailSizeGuide() {
  const dialogRef = this.dialog.open(NailSizeGuideComponent, {
    width: '800px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    panelClass: 'nail-size-guide-dialog'
  });
}

// Create a separate component for the nail size guide

  // Clean up when component is destroyed
  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }

  closeCart() {
    this.cartService.closeCart();
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
  }

  incrementQuantity(item: CartItem) {
    item.quantity++;
  }
  
  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  updateNailSize(productId: number, event: any) {
    const newSize = event.target.value;
    this.cartService.updateNailSize(productId, newSize);
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  proceedToCheckout() {
    const token = localStorage.getItem('token');

    if (!token) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        const loggedIn = !!localStorage.getItem('token');
        if (loggedIn) {
          this.router.navigate(['/checkout']);
        }
      });
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  getImageUrl(productImageUrl: string): string {
    return this.baseUrl +'/products/'+ productImageUrl;
  }
}