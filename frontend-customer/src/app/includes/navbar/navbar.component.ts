import { Component, OnInit } from '@angular/core';
import { MatModule } from '../../appModules/mat.module';
import { LoginComponent } from '../../pages/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../../pages/register/register.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [MatModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isVisible: boolean = false;
  isLoggedIn = true;
  cartCount: number = 0;
  customerName: string | null = null;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0); // ✅ Show total quantity
    });

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.authService.customerName$.subscribe((name) => {
      this.customerName = name;
    });
  }

  logout() {
    this.authService.logout();
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  openRegisterDialog() {
    this.dialog.open(RegisterComponent, {
      width: '400px',
    });
  }

  toggleCart() {
    this.cartService.toggleCart();
  }
  /////////
  myOrders() {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      alert('Please log in to view your orders.');
      return;
    }
    this.router.navigate(['/myallorders', customerId]);
   // this.router.navigate(['/myorders']);
  }
  //////////
}
