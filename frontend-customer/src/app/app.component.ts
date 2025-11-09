import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './includes/navbar/navbar.component';
import { CartComponent } from './pages/cart/cart.component';
import { MatModule } from './appModules/mat.module';
import { FooterComponent } from './includes/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CartComponent, MatModule,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  /**
   *
   */
  constructor() {}
  title = 'testShopping';
}
