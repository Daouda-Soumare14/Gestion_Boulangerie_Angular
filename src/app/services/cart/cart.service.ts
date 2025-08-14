import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8000/api';

  private cartKey = "my_cart";

  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  // observable pour que les composants s'abonnent
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromLocalStorage();
  }

  // Corrigé : chargement depuis localStorage
  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem(this.cartKey);
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    this.cartSubject.next(this.cartItems);
  }

  // Corrigé : sauvegarde dans localStorage
  private saveCartToLocalStorage() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems]; // copie pour immutabilité
  }

  addToCart(product: Product, quantity: number = 1) {
      const correctedProduct = { ...product, price: Number(product.price) };
    const index = this.cartItems.findIndex(item => item.product.id === product.id);

    if (index !== -1) {
      this.cartItems[index].quantity += quantity;
      //this.toastr.info(`Quantité mise a jour pour ${product.name}`, 'Panier');
    } else {
      this.cartItems.push({ product: correctedProduct, quantity });
      //this.toastr.success(`${product.name} ajouter au panier`, 'Panier')
    }

    this.saveCartToLocalStorage();

    // synchroniser avec le serveur
    this.syncCartToServer().subscribe({
      next: () => console.log('Panier synchronisé avec le serveur'),
      error: err => console.error('Erreur de sync', err)
    });
  }

  updateQuantity(productId: number, quantity: number) {
    const index = this.cartItems.findIndex(item => item.product.id === productId);

    if (index !== -1) { // -1 signifi non trouve donc dans notre cas on verifie seulement si le produit est trouve

      const productName = this.cartItems[index].product.name;

      if (quantity <= 0) { // si la nouvelle quantite est 0 ou negative
        this.cartItems.splice(index, 1); //  supprime un element a la position index
        //this.toastr.warning(`${productName} retiré du panier`, 'Panier')
      } else {
        this.cartItems[index].quantity = quantity; // quantite positive on met a jour la quantite dans le panier
        //this.toastr.info(`Quantité mise a jour pour ${productName}`, 'Panier')
      }

      this.saveCartToLocalStorage();

      // synchroniser avec le serveur
      this.syncCartToServer().subscribe({
        next: () => console.log('Panier synchronisé avec le serveur'),
        error: err => console.error('Erreur de sync', err)
      });
    }
  }

  // Corrigé : suppression d’un seul produit
  // removeFromCart(productId: number) {
  //   const itemToRemove = this.cartItems.find(item => item.product.id === productId);

  //   if (itemToRemove) {
  //     const productName = itemToRemove.product.name

  //     this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
  //     this.toastr.warning(`${productName} supprimé du panier`, 'Panier');

  //     this.saveCartToLocalStorage();
  //   }
  // }
  removeFromCart(productId: number) {
    const index = this.cartItems.findIndex(item => item.product.id === productId);

    if (index !== -1) {
      const productName = this.cartItems[index].product.name;

      const confirmDelete = window.confirm(`Supprimer ${productName} du panier ?`);
      if (!confirmDelete) return;

      this.cartItems.splice(index, 1);
      this.saveCartToLocalStorage();

      // synchroniser avec le serveur
      this.syncCartToServer().subscribe({
        next: () => console.log('Panier synchronisé avec le serveur'),
        error: err => console.error('Erreur de sync', err)
      });

      //this.toastr.warning(`${productName} supprimé du panier`, 'Panier');
    }
  }


  clearCart() {
    this.cartItems = [];
    localStorage.removeItem(this.cartKey);
    this.cartSubject.next(this.cartItems);
    //this.toastr.info('Panier vidé avec succès', 'Panier')
  }

  // -------------------
  // Partie synchronisation API (backend Laravel)
  // -------------------

  // Récupérer le panier du serveur Laravel (lié à l’utilisateur connecté).
  fetchCartFromServer(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart`).pipe(
      tap(serverCart => {
        this.cartItems = serverCart;
        this.saveCartToLocalStorage();
      })
    );
  }

  syncCartToServer(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/sync`, { items: this.cartItems });
  }
}

