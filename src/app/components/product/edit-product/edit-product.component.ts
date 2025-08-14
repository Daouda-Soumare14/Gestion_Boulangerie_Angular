import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { CategoryService } from '../../../services/category/category.service';
import { Product } from '../../../models/product/product';
import { Category } from '../../../models/category/category';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {

  productId!: number;
  productForm!: FormGroup;


  categories: Category[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      price: [0, Validators.required],
      quantity: [0, Validators.required],
      image: [null], 
      content: ['', Validators.required],
      category_id: [0, Validators.required]
    })
    this.productId = this.route.snapshot.params['id'];
  

    // charger les categories
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.data;
    });

    // charger les donnees du produit
    this.productService.getProductById(this.productId).subscribe((res: any) => {
      const product: Product = res.data;
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
        });
      });
  }

  onFileSelected(event: any) {
    this.productForm.patchValue({ image: event.target.files[0] });
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
    formData.append('reference', form.reference);
    formData.append('quantity', form.quantity.toString());
    formData.append('category_id', form.category_id.toString());
    formData.append('content', form.content);

    if (form.image instanceof File) {
      formData.append('image', form.image);
    }

    this.productService.editProduct(this.productId, formData).subscribe({
      next: (response) => {
        console.log('Produit mis à jour avec succès', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        alert(JSON.stringify(error.error)); // Pour voir le détail de l'erreur Laravel
      }
    });

  }


}
