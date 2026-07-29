import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { OrderService } from '../services/order';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private orderService = inject(OrderService);
  private router = inject(Router);

  orders: any[] = [];
  inventory: any[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadOrders();
    this.loadInventory();
  }

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadInventory(): void {
    this.orderService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  uploadInventory(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.orderService.uploadInventory(input.files[0]).subscribe({
      next: () => {
        alert("Inventory Uploaded Successfully");
      },
      error: (err) => {
        console.error(err);
        alert("Inventory Upload Failed");
        this.loadInventory();
      }
    });
  }

  uploadOrders(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.orderService.uploadOrders(input.files[0]).subscribe({
      next: () => {
        alert("Orders Uploaded Successfully");
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        alert("Orders Upload Failed");
      }
    });
  }

  openDetails(orderId: string): void {
    this.router.navigate(['/order', orderId]);
  }

  retry(orderId: string): void {
    this.orderService.retryOrder(orderId).subscribe({
      next: () => {
        alert("Retry Successful");
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  markShipped(orderId: string): void {
    this.orderService.markShipped(orderId).subscribe({
      next: () => {
        alert("Order Marked Shipped");
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}