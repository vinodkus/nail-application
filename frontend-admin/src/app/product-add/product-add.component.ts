import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatModule } from '../appModules/mat.module';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '../service/utility.service';
import { ProductAdminService } from '../service/product-admin.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  imports: [MatModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  isEditMode = false;
  currentProductId: number | null = null;
  categoryList: any[] = [];
  productForm!: FormGroup;
  selectedFile: File | null = null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private pas: ProductAdminService
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: [0, Validators.required],
      productShortName: ['', Validators.required],
      productDescription: ['', Validators.required],
      deliveryTimeSpan: ['', Validators.required],
      categoryId: ['', Validators.required],
      image: [null, Validators.required],
      productSku: [''],
      isActive: [true],
    });
  }
  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: [0, Validators.required],
      productShortName: ['', Validators.required],
      productDescription: ['', Validators.required],
      deliveryTimeSpan: ['', Validators.required],
      categoryId: ['', Validators.required],
      productSku: [''],
      isActive: [true],
    });
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.currentProductId = +params['id'];
        this.isEditMode = true;
        this.loadProductDetails(this.currentProductId);
      } else {
        this.isEditMode = false;
        this.currentProductId = null;
        this.productForm.reset();
        this.productForm.patchValue({ categoryId: '' });
      }
    });
  }
  loadCategories() {
    this.utilityService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categoryList = res;
        debugger;
      },
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  loadProductDetails(id: number) {
    this.pas.getProductById(id).subscribe({
      next: (res) => {
        const product = res;
        debugger;
        this.productForm.patchValue({
          productName: product.productName,
          productSku: product.productSku,
          productPrice: product.productPrice,
          productShortName: product.productShortName,
          productDescription: product.productDescription,
          deliveryTimeSpan: product.deliveryTimeSpan,
          categoryId: product.categoryId,
          isActive: product.isActive ?? true,          
        });

        if(product.productImageUrl)
          this.imagePreview = `${this.pas.baseUrl}/products/${product.productImageUrl}`;
      },
      error: (err) => {
        alert('Error loading product details');
      },
    });
  }
  onSubmit(fileInput?: HTMLInputElement) {
    // const uniqueSKU = 'SKU-' + uuidv4().split('-')[0].toUpperCase();
    const formData = new FormData();
    if (this.isEditMode && this.currentProductId) {
      formData.append('id', this.currentProductId.toString());
      formData.append(
        'productSku',
        this.productForm.get('productSku')?.value || ''
      );
    } else {
      const uniqueSKU = 'SKU-' + uuidv4().split('-')[0].toUpperCase();
      formData.append('productSku', uniqueSKU);
    }

    formData.append('productName', this.productForm.get('productName')?.value);
    formData.append(
      'productPrice',
      this.productForm.get('productPrice')?.value
    );
    formData.append(
      'productShortName',
      this.productForm.get('productShortName')?.value
    );
    formData.append(
      'productDescription',
      this.productForm.get('productDescription')?.value
    );
    formData.append(
      'deliveryTimeSpan',
      this.productForm.get('deliveryTimeSpan')?.value
    );
    formData.append('categoryId', this.productForm.get('categoryId')?.value);
    formData.append('isActive', this.productForm.get('isActive')?.value);
    
    //alert('Form submitted');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    ///////////
    if (this.isEditMode) {
      this.pas.updateProduct(this.currentProductId || 0, formData).subscribe({
        next: (res) => {
          alert('Product updated successfully!');
          this.router.navigate(['/products/list']);
        },
        error: (err) => alert('Failed to update product.'),
      });
    } else {
      this.pas.addProduct(formData).subscribe({
        next: (res) => {
          alert(res.message);
          this.productForm.reset();
          this.productForm.patchValue({ categoryId: '' });
        },
        error: (err) => alert('Failed to add product.'),
      });
    }
    ///////////
  }
}
