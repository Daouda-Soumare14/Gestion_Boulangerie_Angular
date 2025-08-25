import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromotionService } from '../../../services/promotion/promotion.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product/product';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-add-pormotion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-pormotion.component.html',
  styleUrl: './add-pormotion.component.css'
})
export class AddPormotionComponent implements OnInit {

  promoForm!: FormGroup;
  products: Product[] = [];
  selectedProducts: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private promoService: PromotionService,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.promoForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      discount_type: ['pourcentage', Validators.required],
      discount_value: [0, [Validators.required, Validators.min(0)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      product_ids: [[]]
    });

    this.loadProduct();
  }

  loadProduct() {
    this.productService.getProducts({}).subscribe((res: any) => {
      console.log(res);
      this.products = res.data;
    });
  }


  toggleProduct(prod: Product) {
    if (this.isSelected(prod)) {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== prod.id);
    } else {
      this.selectedProducts.push(prod);
    }
  }

  isSelected(prod: Product) {
    return this.selectedProducts.some(p => p.id === prod.id);
  }

  createPromotion() {
    if (this.promoForm.invalid) {
      this.promoForm.markAllAsTouched();
      return;
    }

    this.promoForm.patchValue({
      product_ids: this.selectedProducts.map(p => p.id)
    });

    const data = {
      ...this.promoForm.value,
      products: this.selectedProducts
    };


    console.log("Data envoyée", data);

    this.promoService.createPromotion(data).subscribe({
      next: res => {
        console.log("Promotion créée", res);
        this.router.navigate(['/promotions']);
      },
      error: err => console.error("Erreur", err)
    });
  }

}
