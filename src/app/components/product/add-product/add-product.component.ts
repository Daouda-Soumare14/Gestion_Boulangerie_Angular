import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category/category';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {

  productForm!: FormGroup

  categories: Category[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category_id: [null, Validators.required],
      photo: [null],
      allergens: [''],
    });


    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.data ?? res;
    })
  }

  onFileSelected(event: any) {
    this.productForm.patchValue({ photo: event.target.files[0] });
  }

  createProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const form = this.productForm.value;

    formData.append('name', form.name);
    formData.append('description', form.description || '');
    formData.append('price', form.price.toString());
    formData.append('stock', form.stock.toString());
    formData.append('category_id', form.category_id.toString());
    formData.append('allergens', form.allergens || '');

    if (form.photo) {
      formData.append('photo', form.photo);
    }


    this.productService.createProduct(formData).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => alert('Erreur lors de la création du produit'),
    });
  }
}
