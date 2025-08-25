import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackService } from '../../../services/pack/pack.service';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../models/product/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-pack',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-pack.component.html',
  styleUrl: './add-pack.component.css'
})
export class CreatePackComponent {

  packForm!: FormGroup;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private packService: PackService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
  }

  initForm() {
    this.packForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      products: this.fb.array([]) // FormArray pour les produits du pack
    });
  }

  loadProducts() {
  this.productService.getProducts({}).subscribe({
    next: (res: any) => {
      this.products = res.data ?? []; // récupère seulement le tableau
    },
    error: (err) => console.error(err)
  });
}


  get productsArray(): FormArray {
    return this.packForm.get('products') as FormArray;
  }

  // Ajouter un produit au FormArray
  addProduct(product: Product) {
    const exists = this.productsArray.controls.find(c => c.value.product_id === product.id);
    if (!exists) {
      this.productsArray.push(
        this.fb.group({
          product_id: [product.id, Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]]
        })
      );
    }
  }

  toggleProductSelection(prod: Product) {
    if (this.isSelected(prod)) {
      const index = this.productsArray.controls.findIndex(c => c.value.product_id === prod.id);
      if (index >= 0) this.removeProduct(index);
    } else {
      this.addProduct(prod);
    }
  }


  // Supprimer un produit du FormArray
  removeProduct(index: number) {
    this.productsArray.removeAt(index);
  }

  createPack() {
  if (this.packForm.invalid) {
    this.toastr.warning('Veuillez remplir correctement le formulaire.', 'Attention');
    return;
  }

  console.log(this.packForm.value); // vérifie le JSON

  this.packService.createPack(this.packForm.value).subscribe({
    next: (res) => {
      console.log('Pack créé', res);
      this.toastr.success('Le pack a été créé avec succès !', 'Succès');
      this.packForm.reset(); // si tu veux réinitialiser le formulaire après création
    },
    error: (err) => {
      console.error('Erreur', err);
      this.toastr.error('Impossible de créer le pack. Veuillez réessayer.', 'Erreur');
    }
  });
}


  // Vérifie si le produit est déjà dans le pack
  isSelected(product: Product) {
    return this.productsArray.controls.some(c => c.value.product_id === product.id);
  }

  // Quantité d’un produit déjà ajouté
  getProductQuantity(productId: number) {
    const control = this.productsArray.controls.find(c => c.value.product_id === productId);
    return control ? control.value.quantity : 1;
  }

  // Met à jour la quantité dans le FormArray
  updateQuantity(productId: number, qty: number) {
    const control = this.productsArray.controls.find(c => c.value.product_id === productId);
    if (control) control.patchValue({ quantity: qty });
  }
}
