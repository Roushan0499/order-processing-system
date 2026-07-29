import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Inventory } from './inventory/inventory';
import { OrderDetails } from './order-details/order-details';

export const routes: Routes = [

  {
    path: '',
    component: Dashboard
  },

  {
    path: 'inventory',
    component: Inventory
  },

  {
    path: 'order/:id',
    component: OrderDetails
  },

  {
    path: '**',
    redirectTo: ''
  }

];