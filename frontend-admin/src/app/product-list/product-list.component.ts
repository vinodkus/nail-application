import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductAdminService } from '../service/product-admin.service';
import { environment } from '../../environments/environment';
import { MatModule } from '../appModules/mat.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [MatModule],  
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: { categoryId: number; categoryName: string }[] = [];
  selectedCategoryId: number | null = null;

  constructor(private pas: ProductAdminService,private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.pas.getAllProducts().subscribe({
      next: (response: any) => {
        if(!response.result)
        {
          this.products = [];
          this.filteredProducts = [];
          return;
        }
        this.products = response.data ?? [];
        this.filteredProducts = this.products; // initialize
        debugger;
      },
      error: (err: any) => {
        alert('Error loading products');
        console.error(err);
      },
    });
  }

  loadCategories() {
    this.pas.getAllCategories().subscribe({
      next: (res: any) => {
        debugger;
        this.categories = res ?? [];
      },
      error: (err: any) => {
        console.error('Error loading categories', err);
      },
    });
  }

  onCategoryChange(categoryId: any) {
    // Ensure it's a number
    const id = categoryId ? Number(categoryId) : null;

    if (!id) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (product) => Number(product.categoryId) === id
      );
    }
  }

  getImageUrl(product: Product): string {
    return product.productImageUrl
      ? `${environment.apiBaseUrl}/products/${product.productImageUrl}`
      : '';
  }
  
   editProduct(product: Product) {
    this.router.navigate(['/products/add'], {
      queryParams: { id: product.productId },
    });
  }
  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.pas.deleteProduct(productId).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.loadProducts(); // Refresh the product list
        },
        error: (err: any) => {
          alert('Failed to delete product.');
          console.error(err);
        },
      });
    }
  }
}
