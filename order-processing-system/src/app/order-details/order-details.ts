import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../services/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order: any = null;

  // These will come from backend later
  steps: any[] = [];

  logs: any[] = [];

  loading = false;

  ngOnInit(): void {

    const orderId = this.route.snapshot.paramMap.get('id');

    if (orderId) {

      this.loadOrder(orderId);

    }

  }

  loadOrder(orderId: string) {

    this.loading = true;

    this.orderService.getOrder(orderId).subscribe({

      next: (response: any) => {

        /*
          Backend Response (Recommended)

          {
             order:{},
             steps:[],
             logs:[]
          }
        */

        this.order = response.order || response;

        this.steps = response.steps || [];

        this.logs = response.logs || [];

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  back() {

    this.router.navigate(['/']);

  }

}