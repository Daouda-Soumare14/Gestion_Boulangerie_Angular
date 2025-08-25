import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../../models/order/order';
import { OrderService } from '../../../../services/order/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  deliveryStatuses = [
    { key: 'en_preparation', label: 'En préparation' },
    { key: 'prete', label: 'Prête' },
    { key: 'en_livraison', label: 'En livraison' },
    { key: 'livree', label: 'Livrée' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Erreur chargement commandes', err),
    });
  }

  // updateDelivery(order: Order, status: string) {
  //   this.orderService.updateDeliveryStatus(order.id, status).subscribe({
  //     next: (res) => {
  //       order.delivery_status = status; // maj immédiate
  //       alert(res.message);
  //     },
  //     error: (err) => {
  //       console.error('Erreur maj statut livraison', err);
  //       alert('Erreur lors de la mise à jour');
  //     }
  //   });
  // }
}
