import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product/product';
import { ProductService } from '../../services/product/product.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  cartCount: number = 0;
  userName: string = '';

  filters = { search: '' };
  products: Product[] = [];


  constructor(private authService: AuthService, private cartService: CartService, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    })

    if (this.authService.isLoggedIn()) {
      this.userName = this.authService.getUserName();
    }
  }

  @Output() searchChange = new EventEmitter<string>();

  onSearchChange() {
    this.searchChange.emit(this.filters.search); // envoie la valeur à BoutiqueComponent
  }


  isLoggedIn() {
    return this.authService.isLoggedIn();
  }


  getRole() {
    return this.authService.getRole();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['boutique']);
      }, error: () => {
        alert('Erreur lors de la deconnection.');
      }
    })
  }

  getCartCount() {
    return this.cartService.getTotal();
  }
}

