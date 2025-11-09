import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  _authService = inject(AuthService);
  loginObj: any = { username: '', password: '' };
  onLogin() {
    this._authService
      .login(this.loginObj.username, this.loginObj.password)
      .subscribe(
        (data: any) => {
          console.log(data);
          debugger;
          if (data.token != null) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', this.loginObj.username);
            localStorage.setItem('token', data.token);
            debugger;
            this.router.navigateByUrl('admin');
            debugger;
          } else {
            alert('Invalid credentials');
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
}
