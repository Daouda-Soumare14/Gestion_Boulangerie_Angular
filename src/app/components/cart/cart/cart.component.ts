import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product/product';
import { CartItem, CartService } from '../../../services/cart/cart.service';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  
  cartItems: CartItem[] = [];
  suggestedProducs: Product[] = [];

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }
}
