import { MatModule } from './../appModules/mat.module';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterModule,MatModule],

  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  router =inject(Router);
  logout()
  {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    this.router.navigateByUrl("login");
  }
}
