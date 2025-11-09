import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  productImages: string[] = [];
  selectedImage: string = '';
  selectedNailSize: string = 'M';
  isLoading: boolean = false;
  errorMessage: string = '';

  // Mock multiple images for demonstration
  // Replace with actual API call for product images
  mockAdditionalImages: string[] = [
    'product-image-2.jpg',
    'product-image-3.jpg',
    'product-image-4.jpg'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProductDetails();
  }

  loadProductDetails(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!productId) {
      this.errorMessage = 'Invalid product ID';
      return;
    }

    this.isLoading = true;
    
    this.productService.getProductById(productId).subscribe({
      next: (res: any) => {
        if (res.result && res.data) {
          this.product = res.data;
          this.selectedImage = this.getImageUrl(this.product?.productImageUrl);
          
          // Create mock image gallery (replace with actual API call)
          this.productImages = [
            this.selectedImage,
            ...this.mockAdditionalImages.map(img => this.getImageUrl(img))
          ];
        } else {
          this.errorMessage = 'Product not found';
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading product:', err);
        this.errorMessage = 'Failed to load product details';
        this.isLoading = false;
      }
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  selectNailSize(size: string): void {
    this.selectedNailSize = size;
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(this.product, this.selectedNailSize);
    
    this.snackBar.open('Product added to cart!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }

  buyNow(): void {
    if (!this.product) return;

    this.cartService.addToCart(this.product, this.selectedNailSize);
    this.router.navigate(['/cart']);
  }

  getImageUrl(imageFileName?: string): string {
    if (!imageFileName) {
      return 'assets/default-image.png';
    }
    return `${environment.apiBaseUrl}/products/${imageFileName}`;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}