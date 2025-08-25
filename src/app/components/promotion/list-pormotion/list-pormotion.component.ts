import { Component } from '@angular/core';
import { Promotion } from '../../../models/promotion/promotion';
import { PromotionService } from '../../../services/promotion/promotion.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product/product';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-list-pormotion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-pormotion.component.html',
  styleUrl: './list-pormotion.component.css'
})
export class ListPormotionComponent {

   promotions: Promotion[] = [];
   products: Product[] = [];

  constructor(private promoService: PromotionService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadPromotions();
    // this.loadProducts();
  }

  loadPromotions(): void {
    this.promoService.getPromotions().subscribe(data => {
      this.promotions = data;
    });
  }

  // loadProducts() {
  //   this.productService.getProducts().subscribe(data => {
  //     this.products = data;
  //   })
  // }

  deletePromo(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette promotion ?")) {
      this.promoService.deletePromotion(id).subscribe(() => {
        this.loadPromotions();
      });
    }
  }
}
