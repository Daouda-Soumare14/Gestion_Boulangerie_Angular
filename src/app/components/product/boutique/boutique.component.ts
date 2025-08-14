import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { CategoryService } from '../../../services/category/category.service';
import { Product } from '../../../models/product/product';
import { Category } from '../../../models/category/category';


@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique.component.html',
  styleUrl: './boutique.component.css'
})
export class BoutiqueComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  lastPage = 1;

  filters = {
    search: '',
    category_id: null,
    min_price: null,
    max_price: null
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,

  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(page: number = 1): void {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res;
      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
    })
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    })
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

  // ajouter un produit au panier
  addToCart(product: Product) {
    console.log('Ajout au panier:', product);
    // this.cartService.addToCart(product, 1);
  }
}
