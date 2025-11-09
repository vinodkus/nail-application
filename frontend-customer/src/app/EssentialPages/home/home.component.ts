import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  galleryItems = [
    { image: 'assets/images/gallery-1.jpg', title: 'French Tips' },
    { image: 'assets/images/gallery-2.jpg', title: 'Ombre Nails' },
    { image: 'assets/images/gallery-3.jpg', title: 'Custom Art' },
    { image: 'assets/images/gallery-4.jpg', title: 'Bridal Nails' }
  ];
}