import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackService } from '../../../services/pack/pack.service';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../models/product/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-pack',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-pack.component.html',
  styleUrl: './update-pack.component.css'
})
export class UpdatePackComponent {

  packForm!: FormGroup;
  products: Product[] = [];
  packId!: number;

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.packId = this.route.snapshot.params['id'];
    this.loadProducts();
    this.loadPack();
  }

  initForm() {
    this.packForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      products: this.fb.array([])
    });
  }

  loadProducts() {
    this.productService.getProducts({}, 1).subscribe({
      next: (data) => this.products = data || data,
      error: (err) => console.error(err)
    });
  }

  loadPack() {
  this.packService.getPack(this.packId).subscribe({
    next: (pack) => {
      const productsArray = pack.products?.map((p: any) =>
        this.fb.group({
          product_id: [p.product_id, Validators.required],
          quantity: [p.quantity ?? 1, [Validators.required, Validators.min(1)]]
        })
      ) || [];

      this.packForm = this.fb.group({
        name: [pack.name, Validators.required],
        description: [pack.description],
        price: [pack.price, [Validators.required, Validators.min(0)]],
        products: this.fb.array(productsArray)
      });
    },
    error: (err) => console.error(err)
  });
}


  get productsArray(): FormArray {
    return this.packForm.get('products') as FormArray;
  }

  toggleProduct(product: Product) {
    const index = this.productsArray.controls.findIndex(ctrl => ctrl.value.product_id === product.id);
    if (index !== -1) {
      this.productsArray.removeAt(index);
    } else {
      this.productsArray.push(this.fb.group({
        product_id: [product.id],
        quantity: [1, [Validators.required, Validators.min(1)]]
      }));
    }
  }

  isSelected(product: Product): boolean {
    return this.productsArray.controls.some(ctrl => ctrl.value.product_id === product.id);
  }

  updateQuantity(index: number, quantity: number) {
    this.productsArray.at(index).get('quantity')?.setValue(quantity);
  }

  getProductQuantity(productId: number): number {
    const ctrl = this.productsArray.controls.find(c => c.value.product_id === productId);
    return ctrl ? ctrl.value.quantity : 1;
  }


  updatePack() {
    if (this.packForm.invalid) return;
    this.packService.updatePack(this.packId, this.packForm.value).subscribe({
      next: () => {
        this.toastr.success('Pack modifié avec succès');
        this.router.navigate(['/packs']);
      },
      error: (err) => console.error(err)
    });
  }
}
