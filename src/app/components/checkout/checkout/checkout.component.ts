import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { OrderService } from '../../../services/order/order.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  orderData!: FormGroup;
  cartItems: any[] = [];
  currentUser: any;
  orderCreated: any = null; // ajouter en haut avec les autres propriétés


  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.orderData = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      payment_mode: ['livraison', Validators.required]
    });

    const savedUser = localStorage.getItem('current_user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      this.authService.currentUserSubject.next(JSON.parse(savedUser));
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (this.currentUser) {
        this.orderData.patchValue({
          name: this.currentUser.name,
          email: this.currentUser.email
        });
      }
    });



    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }


  totalProducts(): number {
    return this.cartService.getTotal();
  }

  confirmOrder() {
    console.log('savedUser from localStorage:', this.currentUser);
    if (!this.currentUser) {
      console.error('Utilisateur non connecté');
      return;
    }

    const order = {
      user_id: this.currentUser?.id,
      order_status: 'validee',            // back le veut
      delivery_status: 'en_preparation',           // back le veut aussi
      payment_mode: this.orderData.value.payment_mode,
      total: this.cartService.getTotal(),
      client_info: {
        name: this.orderData.value.name || this.currentUser.name,
        email: this.orderData.value.email || this.currentUser.email,
        phone: this.orderData.value.phone || '',       // si l’API attend un string
        address: this.orderData.value.address || '',   // si l’API attend un string
      },
      items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    };




    this.orderService.createOrder(order).subscribe({
      next: res => {
        console.log('Commande OK', res);
        this.orderCreated = res.order;
        this.cartService.clearCart();
        this.toastr.success('Votre commande a été créée avec succès !', 'Commande');
      },
      error: err => console.error('Erreur Laravel:', err.error)
    });

  }


}
