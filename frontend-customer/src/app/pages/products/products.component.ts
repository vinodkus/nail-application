import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatModule } from '../../appModules/mat.module';
import { Category, Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [MatModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  productsArray: Product[] = [];
  categoryArray: Category[] = [];
  noProductsFound: boolean = false;
  selectedCategoryId: number = 0;

  isLoading = false;

  constructor(private ps: ProductService, private cartService: CartService, private snackBar: MatSnackBar,  private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading = true;
    this.ps.getAllProducts().subscribe({
      next: (res: any) => {
        debugger;
        this.productsArray = res.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  loadCategories() {
    this.isLoading = true;
    this.ps.getAllCategories().subscribe({
      next: (res: any) => {
        this.categoryArray = res.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  getAllProductsByCatId(categoryId: number) {
    this.isLoading = true;
    this.selectedCategoryId = categoryId;

    this.ps.getAllProductsByCategoryId(categoryId).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.productsArray = res.data;
          this.noProductsFound = false;
        } else {
          this.productsArray = [];
          this.noProductsFound = true;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.productsArray = [];
        this.noProductsFound = true;
        this.isLoading = false;
      },
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.snackBar.open('Product added to cart!', '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'], // Optional custom style
    });
  }

  getImageUrl(imageFileName?: string): string {
    if (!imageFileName) {
      return 'assets/default-image.png';
    }
    return `${environment.apiBaseUrl}/products/${imageFileName}`;
  }
    goToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
}
