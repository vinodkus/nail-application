import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartVisible = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisible.asObservable();

  private items = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  items$ = this.items.asObservable();
  readonly nailSizes = ['XS', 'S', 'M', 'L'];
  constructor() {}

  private loadCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem('cartItems');
   // return stored ? JSON.parse(stored) : [];
   if (stored) {
      const items = JSON.parse(stored);
      // Ensure each item has nailSize property with default value
      return items.map((item: CartItem) => ({
        ...item,
        nailSize: item.nailSize || 'M' // Default to 'M'
      }));
    }
    return [];
  }

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }
  private clearCartStorage() {
    localStorage.removeItem('cartItems');
  }

 addToCart(item: any, nailSize: string = 'M') {
    const currentItems = this.items.value;
    const existingItem = currentItems.find(
      (p) => p.productId === item.productId && p.nailSize === nailSize
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
       currentItems.push({
        ...item,
        quantity: 1,
        nailSize: nailSize
      });
    }

    this.items.next([...currentItems]);
    this.saveCartToStorage(currentItems);
  }
updateNailSize(productId: number, nailSize: string) {
    const currentItems = this.items.value;
    const item = currentItems.find(item => item.productId === productId);
    if (item) {
      item.nailSize = nailSize;
      this.items.next([...currentItems]);
      this.saveCartToStorage(currentItems);
    }
  }
  toggleCart() {
    this.cartVisible.next(!this.cartVisible.value);
  }

  openCart() {
    this.cartVisible.next(true);
  }

  closeCart() {
    this.cartVisible.next(false);
  }
clearCart() {
  this.items.next([]);
  this.clearCartStorage();
  this.cartVisible.next(false); // Close the cart after clearing it
}
  removeItem(productId: number) {
    const updatedItems = this.items.value.filter(
      (item) => item.productId !== productId
    );
    this.items.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }
}
