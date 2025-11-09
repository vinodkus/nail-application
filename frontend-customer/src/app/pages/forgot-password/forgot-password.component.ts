import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatModule } from '../../appModules/mat.module';

import { CustomerService } from '../../services/customer.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']  // ✅ Now with dedicated CSS
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  message = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialog: MatDialog,    
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const email = this.forgotForm.get('email')?.value;

    this.customerService.forgotPassword(email).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = response.message || 'Password reset link has been sent to your email.';
        
        // Auto close after 3 seconds on success
        if (response.success) {
          setTimeout(() => {
            this.dialogRef.close();
          }, 3000);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  close(): void {
    this.dialogRef.close();
     this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }
}