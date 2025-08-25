import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product/product';
import { Category } from '../../../models/category/category';
import { ProductService } from '../../../services/product/product.service';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  lastPage = 1;

  filters = {
    category_id: '',
    min_price: '',
    max_price: ''
  };

  constructor(private productService: ProductService, private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(page: number = 1): void {
    this.productService.getProducts(this.filters, page).subscribe((res: any) => {
      console.log(res);
      this.products = res.data;
    })
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    })
  }

  deleteProduct(id: number) {
    if (confirm("Etes vous sur de vouloir supprimé ce produit ?")) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((p: Product) => p.id !== id)
          this.router.navigate(['products']);
        }, error: () => alert('Erreur lors de la suppression du produit !!!')
      });
    }
  }

  resetFilters(): void {
    this.filters = {
      category_id: '',
      min_price: '',
      max_price: ''
    };
    this.loadProducts();
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
}
