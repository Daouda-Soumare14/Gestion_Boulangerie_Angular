import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Product } from '../../models/product/product';
import { Category } from '../../models/category/category';
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from '../../services/promotion/promotion.service';
import { PackService } from '../../services/pack/pack.service';
import { Pack } from '../../models/pack/pack';
import { AuthService } from '../../services/auth/auth.service';
import { SidebarComponent } from "../sidebar/sidebar.component";


@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './boutique.component.html',
  styleUrl: './boutique.component.css'
})
export class BoutiqueComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  lastPage = 1;
  promotions: any[] = [];
  selectedProduct: Product | null = null;
  bootstrap: any;
  heroProducts: Product[] = [];
  packs: Pack[] = [];
  selectedItem: Product | Pack | undefined;
  zoomedImage: string = '';


  filters = {
    search: '',
    category_id: null,
    min_price: null,
    max_price: null
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private toastr: ToastrService,
    private packService: PackService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadHeroProducts();
    this.loadPacks();
  }

  loadProducts(page: number = 1): void {
    this.productService.getProducts(this.filters, page).subscribe((res: any) => {
      this.products = res.data;
      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
    })
  }

  onSearch(searchTerm: string) {
    this.filters.search = searchTerm;
    this.loadProducts();

    // Scroll vers la section produits
    const element = document.querySelector('section.col-lg-9');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    })
  }

  loadPacks() {
    this.packService.getPacks().subscribe(res => {
      this.packs = res ?? [];
    });
  }

  nextPage() {
    if (this.currentPage < this.lastPage) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadProducts(this.currentPage - 1);
    }
  }


  resetFilters(): void {
    this.filters = {
      search: '',
      category_id: null,
      min_price: null,
      max_price: null,
    };
    this.loadProducts();
  }

  scrollToProducts() {
    const element = document.querySelector('section.col-lg-9');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  // Retourne true si le produit est dans une promotion
  isProductInPromo(product: Product): boolean {
    return !!(product.promotions && product.promotions.length > 0);
  }


  loadHeroProducts() {
    this.productService.getHeroProducts().subscribe({
      next: (data) => this.heroProducts = data,
      error: (err) => console.error(err)
    });
  }

  // ajouter un produit au panier
  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.storePendingCartItem({ type: 'product', item: product });
      localStorage.setItem('redirectUrl', '/cart'); // redirection après login
      this.openAuthModal(); // afficher le modal
      return;
    }

    console.log('Ajout au panier:', product);
    this.cartService.addToCart(product, 1);
    this.toastr.success(`${product.name} ajouter au panier`, 'Panier', {
      toastClass: 'ngx-toastr custom-toast',
    })
  }

  addPackToCart(pack: any) {
    if (!this.authService.isLoggedIn()) {
      this.storePendingCartItem({ type: 'pack', item: pack });
      localStorage.setItem('redirectUrl', '/cart'); // redirection après login
      this.openAuthModal(); // afficher le modal
      return;
    }

    pack.products.forEach((product: Product) => {
      this.cartService.addToCart(product, 1);
    });
    this.toastr.success(`Pack "${pack.name}" ajouté au panier`, 'Panier', {
      toastClass: 'ngx-toastr custom-toast',
    });
  }

  // Dans le modal : bouton Ajouter au panier
  addItemToCart() {
    if (!this.selectedItem) return;

    if (!this.authService.isLoggedIn()) {
      const type = this.isPack(this.selectedItem) ? 'pack' : 'product';
      this.storePendingCartItem({ type, item: this.selectedItem });
      localStorage.setItem('redirectUrl', '/cart'); // redirection après login
      this.openAuthModal(); // afficher le modal
      return;
    }

    if (this.isPack(this.selectedItem)) {
      this.addPackToCart(this.selectedItem);
    } else {
      this.addToCart(this.selectedItem);
    }
  }

  openAuthModal() {
    const modalElement = document.getElementById('authModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Stocker l'action en attente dans localStorage
  storePendingCartItem(data: { type: 'product' | 'pack', item: any }) {
    localStorage.setItem('pendingCartItem', JSON.stringify(data));
  }

  isPack(item: Product | Pack): item is Pack {
    return (item as Pack).products !== undefined;
  }

  // Retourne true si au moins un produit du pack est en promo
  isPackInPromo(pack: Pack): boolean {
    return pack.products.some(p => p.promotions && p.promotions.length > 0);
  }



  openItemModal(item: Product | Pack) {
    this.selectedItem = item;
    const modalElement = document.getElementById('itemModal'); // modal HTML renommé
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openZoom(imageUrl: string) {
    this.zoomedImage = imageUrl;
    const modalElement = document.getElementById('zoomModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
