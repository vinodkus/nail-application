import { Component, OnInit } from '@angular/core';
import { MatModule } from '../../appModules/mat.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-register',
  imports: [MatModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hide = true;
  hideConfirm = true;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private dialog: MatDialog,
    private cs: CustomerService
  ) {}
  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { Validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
  onSubmit() {
    if (this.registerForm.invalid) return;
    const formData = this.registerForm.value;
    this.cs.addCustomer(formData).subscribe({
      next:(res:any)=>{
        debugger;
        if(res.result){
          alert(res.message);
          this.dialogRef.close();
          this.openLoginDialog();
          this.dialog.open(LoginComponent,{width:'400px'});
        }
      },//end next
      error:(err:any)=>{
        debugger;
        alert(err.error);
          //alert(err.error?.message|| 'Registration failed. Please try again later.');
      }//end error
    })

  }// end onSubmit


  openLoginDialog() {
    debugger;
    this.dialogRef.close(); // Close the Register popup
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }


}
