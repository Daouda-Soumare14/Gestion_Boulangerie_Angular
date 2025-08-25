import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category/category';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productForm!: FormGroup;
  categories: Category[] = [];
  productId!: number;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      category_id: [null, Validators.required],
      photo: [null],
      allergens: ['']
    });

    this.productId = this.route.snapshot.params['id'];

    // charger les catégories
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.data ?? res;
    });

    // charger les données du produit
    this.productService.getProductById(this.productId).subscribe((res: any) => {
      const product = res.data;
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        category_id: product.category_id,
        allergens: product.allergens
      });
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.productForm.patchValue({ photo: event.target.files[0] });
    }
  }

  updateProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const form = this.productForm.value;

    formData.append('name', form.name);
    formData.append('price', form.price.toString());
    formData.append('stock', form.stock.toString());
    formData.append('category_id', form.category_id.toString());
    formData.append('description', form.description || '');
    formData.append('allergens', form.allergens || '');

    if (form.photo instanceof File) {
      formData.append('photo', form.photo);
    }

    this.productService.editProduct(this.productId, formData).subscribe({
      next: () => {
        console.log('Produit mis à jour avec succès');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du produit', error);
        alert(JSON.stringify(error.error));
      }
    });
  }
}
