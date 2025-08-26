import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Product } from '../../../models/product/product';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cartService: CartService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Fermer le modal si ouvert
        const modalEl = document.getElementById('authModal');
        if (modalEl) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }

        // Vérifier si un produit/pack est en attente
        const pending = localStorage.getItem('pendingCartItem');
        if (pending) {
          const { type, item } = JSON.parse(pending);
          if (type === 'product') this.cartService.addToCart(item, 1);
          if (type === 'pack') item.products.forEach((p: Product) => this.cartService.addToCart(p, 1));

          localStorage.removeItem('pendingCartItem');
        }

        // Rediriger vers l'URL demandée ou boutique par défaut
        const redirectUrl = localStorage.getItem('redirectUrl') || '/boutique';
        localStorage.removeItem('redirectUrl');
        this.router.navigateByUrl(redirectUrl);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
