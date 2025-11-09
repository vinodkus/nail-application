import { AdminOrdersService } from './../service/AdminOrders.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nails-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './nails-order.component.html',
  styleUrl: './nails-order.component.css',
})
export class NailsOrderComponent implements OnInit {
  NailsOrder: any[] = [];

  constructor(private ordersService: AdminOrdersService) {
    // You can inject services here if needed
  }

  ngOnInit(): void {
    // Initialization logic can go here

    this.ordersService.getAllOrders().subscribe((data) => {
      this.NailsOrder = data;
      debugger;
    });
  }

  updateOrderStatus(order: any) {
    debugger;
    this.ordersService
      .updateOrderStatus(order.orderId, order.status)
      .subscribe({
        next: () => {
          alert('Order status updated successfully.');
        },
        error: () => {
          alert('Failed to update status.');
        },
      });
  }
}
