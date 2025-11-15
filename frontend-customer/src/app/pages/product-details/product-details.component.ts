import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatModule } from '../../appModules/mat.module';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  public baseUrl = environment.apiBaseUrl;

  product: Product | null = null;
  selectedImage: string = '';
  quantity: number = 1;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  loadProductDetails(productId: number): void {
    this.isLoading = true;
    debugger;
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        // Set the first image as selected (main image or first additional image)
        if (product.additionalImages && product.additionalImages.length > 0) {
          this.selectedImage = this.getFullImageUrl(product.additionalImages[0].imageUrl);
        } else if (product.productImageUrl) {
          this.selectedImage = this.getFullImageUrl(product.productImageUrl);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load product details';
        this.isLoading = false;
        console.error('Error loading product:', error);
      }
    });
  }
handleImageError(event: any): void {
  event.target.src = '/assets/images/placeholder.jpg';
}
  getFullImageUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    
    // If it's already a full URL, return as is
    if (relativeUrl.startsWith('http')) {
      return relativeUrl;
    }
    
    // Adjust based on your API URL structure
  //  const baseUrl = 'https://localhost:7161'; // Your API base URL
    if (relativeUrl.startsWith('/')) {
      return `${this.baseUrl}${relativeUrl}`;
    }
    
    return `${this.baseUrl}/products/${relativeUrl}`;
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = this.getFullImageUrl(imageUrl);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
debugger;
    const cartItem = {
      productId: this.product.productId,
      productName: this.product.productName,
      productPrice: this.product.productPrice,
      quantity: this.quantity,
      // productImage: this.selectedImage,
      productImageUrl:this.product.productImageUrl,   
      productSku: this.product.productSku
    };

    this.cartService.addToCart(cartItem);
    
    // Show success message (you can use a toast service here)
    alert(`${this.product.productName} added to cart!`);
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  get allImages(): string[] {
    if (!this.product) return [];
    
    const images: string[] = [];
    
    // Add main product image
    if (this.product.productImageUrl) {
      images.push(this.getFullImageUrl(this.product.productImageUrl));
    }
    
    // Add additional images
    if (this.product.additionalImages) {
      this.product.additionalImages.forEach(img => {
        images.push(this.getFullImageUrl(img.imageUrl));
      });
    }
    
    return images;
  }
}