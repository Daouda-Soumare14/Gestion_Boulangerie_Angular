import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  cartCount: number = 0;

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    })
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
        this.router.navigate(['login']);
      }, error: () => {
        alert('Erreur lors de la deconnection.');
      }
    })
  }

  getCartCount() {
    return this.cartService.getTotal();
  }


  goToCart() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/cart']);
      return;
    } else {
      alert('Veuillez vous connecter pour accéder au panier.');
      this.router.navigate(['/login']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

