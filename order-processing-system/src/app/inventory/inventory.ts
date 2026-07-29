import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {

  private orderService = inject(OrderService);
  private router = inject(Router);

  inventory: any[] = [];

  loading = false;

  ngOnInit(): void {

    this.getInventory();

  }

  goBack(): void {

    this.router.navigate(['/']);

  }

  getInventory(): void {

    this.loading = true;

    this.orderService.getInventory().subscribe({

      next: (data: any[]) => {

        this.inventory = data;

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

}