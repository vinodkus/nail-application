import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatModule } from '../../appModules/mat.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword: boolean = true;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog,
    private cs: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    debugger;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.cs.loginCustomer(this.loginForm.value).subscribe({
      next: (res: any) => {
        debugger;
        console.log(res);
        this.loading = false;
        
        // Check if response has token and user details
        if (res.token) {
          // Store user details in auth service
          const userName = res.name || 'User';
          const userEmail = res.email || this.loginForm.value.email;
          const userId = res.id ? res.id.toString() : '';
          
          this.authService.login(res.token, userName, userEmail, userId);
          
          // Show success message
          this.showSuccessMessage('Login successful!');
          this.dialogRef.close(true);
        } else {
          this.errorMessage = 'Invalid response from server';
        }
      },
      error: (err: any) => {
        debugger;
        this.loading = false;
        console.error('Login error:', err);
        
        // Handle different types of errors
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        }
      },
    });
  }

  openRegister(): void {
    this.dialogRef.close(); // Close Login
    this.dialog.open(RegisterComponent, {
      width: '450px',
      panelClass: 'register-dialog'
    });
  }

  forgotPassword(): void {
    this.dialogRef.close(true);
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px',
      panelClass: 'forgot-password-dialog'
    });
  }

  socialLogin(provider: string): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Simulate social login (you can implement actual social login later)
    setTimeout(() => {
      this.loading = false;
      this.errorMessage = `${provider} login is not implemented yet. Please use email login.`;
    }, 1000);
  }

  private showSuccessMessage(message: string): void {
    // You can use a snackbar or keep the current approach
    console.log(message);
    // If you want to show a snackbar, inject MatSnackBar and use it here
  }
}