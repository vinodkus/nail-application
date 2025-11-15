import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatModule } from '../appModules/mat.module';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '../service/utility.service';
import { ProductAdminService } from '../service/product-admin.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';

declare var bootstrap: any;
interface FileWithPreview {
  file: File;
  preview: string;
}
@Component({
  selector: 'app-product-add',
  imports: [MatModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('modalFileInput') modalFileInput!: ElementRef; // Add this
  imagePreview: string | ArrayBuffer | null = null;
  isEditMode = false;
  currentProductId: number | null = null;
  categoryList: any[] = [];
  productForm!: FormGroup;
  selectedFile: File | null = null;

  // Image Upload Modal Properties
  isDragOver = false;
  selectedFiles: FileWithPreview[] = []; // Use the interface
  isUploading = false;
  uploadProgress = 0;
  existingImages: any[] = [];
  modal: any; // Add modal instance
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
    if (this.selectedFile) {
      this.previewImage(this.selectedFile);
    }
  }
  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
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

        if (product.productImageUrl)
          this.imagePreview = `${this.pas.baseUrl}/products/${product.productImageUrl}`;

        // Load existing product images for the modal
        if (product.additionalImages) {
         // this.existingImages = product.additionalImages;
           this.existingImages = product.additionalImages.map(img => ({
          ...img,
           imageUrl: this.getFullImageUrl(img.imageUrl)
        }));
        }
      },
      error: (err) => {
        alert('Error loading product details');
      },
    });
  }
  getFullImageUrl(relativeUrl: string): string {
  if (!relativeUrl) return '';
  
  // If it's already a full URL, return as is
  if (relativeUrl.startsWith('http')) {
    return relativeUrl;
  }
  
  // If it starts with /, use it directly
  if (relativeUrl.startsWith('/')) {
    return `${this.pas.baseUrl}${relativeUrl}`;
  }
  
  // Otherwise, assume it's in the uploads/products folder
  return `${this.pas.baseUrl}/products/${relativeUrl}`;
}
  openImageUploadModal() {
    // Reset selected files when opening modal
    this.selectedFiles = [];

    const modalElement = document.getElementById('imageUploadModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    } else {
      console.error('Bootstrap is not available');
      // Fallback: show the modal directly
      const modalElement = document.getElementById('imageUploadModal');
      if (modalElement) {
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.setAttribute('aria-hidden', 'false');
      }
    }
  }
 onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFilesSelected(event: any) {
    debugger;
    console.log('Files selected:', event.target.files);
    this.handleFiles(event.target.files);
  }

  handleFiles(files: FileList) {
    debugger;
    console.log('Handling files:', files);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.validateFile(file)) {
        // Generate preview immediately and store it
        const preview = URL.createObjectURL(file);
        this.selectedFiles.push({ file, preview });
      }
    }
    console.log('Selected files after handling:', this.selectedFiles);
  }

  validateFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files are allowed (JPEG, PNG, GIF, WebP)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return false;
    }
    
    return true;
  }

  getFilePreview(fileItem: FileWithPreview): string {
    return fileItem.preview;
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(index: number) {
    // Revoke the object URL to prevent memory leaks
    if (this.selectedFiles[index]) {
      URL.revokeObjectURL(this.getFilePreview(this.selectedFiles[index]));
    }
    this.selectedFiles.splice(index, 1);
  }

  uploadImages() {
    if (!this.currentProductId || this.selectedFiles.length === 0) {
      alert('No product ID or files selected');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // Upload files one by one
    this.uploadFilesSequentially(0);
  }

 private uploadFilesSequentially(index: number) {
  debugger;
    if (index >= this.selectedFiles.length) {
      // All files uploaded
      this.isUploading = false;
      this.uploadProgress = 100;
      
      // Show success message and close modal
      setTimeout(() => {
        alert('Images uploaded successfully!');
        this.closeModalAndReset();
        this.loadProductDetails(this.currentProductId!);
      }, 500);
      return;
    }

    const fileItem = this.selectedFiles[index];
    const formData = new FormData();
    formData.append('ProductId', this.currentProductId!.toString());
    formData.append('SortOrder', index.toString());
    formData.append('Image', fileItem.file, fileItem.file.name);

    // Update progress
    this.uploadProgress = Math.round((index / this.selectedFiles.length) * 100);

    // Call your service to upload the image
    this.pas.uploadProductImage(formData).subscribe({
      next: (response) => {
        // Upload next file
        this.uploadFilesSequentially(index + 1);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        alert(`Error uploading ${fileItem.file.name}. Please try again.`);
        this.isUploading = false;
      }
    });
  }

  private closeModalAndReset() {
    // Close modal using Bootstrap
    if (this.modal) {
      this.modal.hide();
    } else {
      // Fallback: hide modal manually
      const modalElement = document.getElementById('imageUploadModal');
      if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
      }
    }

    // Clean up object URLs
    this.selectedFiles.forEach(file => {
      URL.revokeObjectURL(this.getFilePreview(file));
    });

    // Reset state
    this.selectedFiles = [];
    this.isUploading = false;
    this.uploadProgress = 0;
    
    // Reset modal file input
    if (this.modalFileInput) {
      this.modalFileInput.nativeElement.value = '';
    }
  }
  // Clean up object URLs when component is destroyed
  ngOnDestroy() {
    this.selectedFiles.forEach((file) => {
      URL.revokeObjectURL(this.getFilePreview(file));
    });
  }
  onSubmit(fileInput?: HTMLInputElement) {
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

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

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
  }
}
